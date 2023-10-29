import { Pinecone } from '@pinecone-database/pinecone';    
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
const { Storage } = require("@google-cloud/storage");
import {Document, RecursiveCharacterTextSplitter} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import {createVault, addFile} from "./arweave";
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage({
  projectId: "clear-radio-398914",
  credentials: {
    client_email: process.env.GCS_CLIENT_EMAIL,
    private_key: process.env.GCS_PRIVATE_KEY?.split(String.raw`\n`).join("\n"),
  },
});


type VMetadata = {
    id:string;
    values:number[];
    metadata: {
        text:string;
        pageNumber:number;
    }
}



type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber:number}
    }
}




export async function loadFileIntoPinecone() {
  const loader = new PDFLoader("tmp/file.pdf");
  const pages = await loader.load();
  return pages;
}


// download from cloud and process
export async function downloadFromCloud(file_key: string) {
  const options = {
    destination: "tmp/file.pdf",
  };

  console.log(options.destination);

  // Downloads the file
  await storage.bucket("nyay_bucket_files").file(file_key).download(options);

  const id = uuidv4();

  const vaultId = await createVault(id);

  console.log(vaultId);

  const stackId = await addFile(vaultId, "tmp/file.pdf", file_key);
  
  console.log(stackId);

  // break into pages
  const pages = (await loadFileIntoPinecone()) as PDFPage[];

  // further breaks into smaller chunks
  const documents = await Promise.all(pages.map(prepareDocument));

  //vectorize and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedoc))

  // upload to pinecone db
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIROMENT!,
  });
  const namespace = md5(file_key);
  console.log(namespace, "lol");
  const pineconeIndex = pinecone.index("nyay-index").namespace(namespace!);
  await pineconeIndex.upsert(vectors);

  return namespace;
}


// get the embeddings
async function embedoc(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = md5(doc.pageContent);
        return {
            id: hash,
            values: embeddings,
            metadata:{
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as VMetadata
    } catch (error:any) {
        console.log("error in embeddings");
        throw error;
    }
}


// string bytes
export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}


// prepare the documents
async function prepareDocument(page:PDFPage) {
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/\n/g, '');
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ])
    return docs;
}