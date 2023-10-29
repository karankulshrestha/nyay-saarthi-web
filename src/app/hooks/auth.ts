import React, { use } from 'react'
import { UserProp } from './types'


export async function postUser(user: UserProp) {
    const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    console.log(response);
    return await response;
}

export async function sendMsg({
  question,
  chatHistory,
  namespace
}: {
  question: string,
  chatHistory: [string, string][],
  namespace: string
}){
  const response = await fetch("/api/chat-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      chatHistory,
      namespace:namespace
    }),
  });
  return await response;
};