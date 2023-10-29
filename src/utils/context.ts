import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  namespace: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIROMENT!,
  });

  const index = await pinecone.index("nyay-index");
  const ns1 = index.namespace(namespace);

  try {
    const result = await ns1.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return result.matches || [];
  } catch (error) {
    console.log("error querying embeddings", error);
  }
}

export async function getContext(query: string, namespace: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, namespace);

  const docs = matches?.filter(
    (matches) => matches.score && matches.score > 0.7
  );


  type Metadata = {
    text: string,
    pageNumber: number
  }

  let textDocs = docs?.map(match => (match.metadata as Metadata).text)

  console.log(docs);

  return textDocs?.join("\n").substring(0, 3000);
}
