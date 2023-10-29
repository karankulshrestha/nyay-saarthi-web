import { GoogleVertexAIEmbeddings } from "langchain/embeddings/googlevertexai";


export async function getEmbeddings(text:string) {
    const model = new GoogleVertexAIEmbeddings();
    const res = await model.embedQuery(
      text
    );
    console.log(res);
    return res;
  }

