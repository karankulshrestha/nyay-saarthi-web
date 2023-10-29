import { GoogleVertexAIEmbeddings } from "langchain/embeddings/googlevertexai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";


export async function getVectorStore(client: PineconeClient, namespace: string) {
  try {
    const embeddings = new GoogleVertexAIEmbeddings();
    const index = client.Index("nyay-index");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
      namespace: namespace,
    });

    return vectorStore;
  } catch (error) {
    console.log("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}