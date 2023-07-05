<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://github.com/vdutts7/constitutionGPT/blob/main/public/favicon.png" alt="Logo" width="80" height="80">
    <img src="https://github.com/vdutts7/yt-chat-mkbhd/blob/main/public/openai.png" alt="Logo" width="67" height="67">

  
  </a>
  <h2 align="center">Constitution GPT </h2> <p align="center"> AI chat over the US Constitution 📜 💬 🇺🇸
<br /> <a href=https://constitution-gpt.vercel.app/>LINK</a>  </p> </div> <p align="center"> <img src="https://github.com/vdutts7/constitutionGPT/blob/main/public/screen-rec.gif"/> </p>  


<!-- TABLE OF CONTENTS -->
## Table of Contents
  <ol>
    <a href="#about">📝 About</a>
        <ul>
        </ul>
    <a href="#how-to-build">💻 How to build</a>
        <ul>
            <li><a href="#initial-setup">Initial setup</a></li>
            <li><a href=#embeddings-backend>Embeddings backend</a></li>
            <li><a href=#chat-frontend>Chat frontend</a></li>
            <li><a href=#run-app>Run app</a></li>
        </ul>
    <a href="#next-steps">🚀 Next steps</a>
        <ul>
            <li><a href=#deploy>Deploy</a></li>
            <li><a href=#customizations>Customizations</a></li>
        </ul>
    <a href="#tools-used">🔧 Tools used</a>
        <ul>
        </ul>
    <a href="#contact">👤 Contact</a>
  </ol>

<br ></br>

<!-- ABOUT -->
## 📝 About

Chat with US Constitution. Combines pgvector embeddings (Supabase), OpenAI, and NextJs to provide frntend UI chat interface.

<p align="right">(<a href="#readme-top">back to top</a>)</p> 


## 💻 How to build 
_Note: macOS version, adjust accordingly for Windows / Linux_

### Initial setup

Clone and install dependencies:

```
git clone https://github.com/vdutts7/constitutionGPT
cd constitutionGPT
npm i
```

Copy `.env.example` and rename to `.env` in root directory. Fill out API keys:

```
SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""
OPENAI_API_KEY=""

#optional- leave blank if unused. DO NOT DELETE
OPENAI_PROXY=""
SPLASH_URL=""
```

Get API keys:
- [OpenAI](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key)
- [Supabase](https://supabase.com/)
      
_**IMPORTANT: Verify that `.gitignore` contains `.env` in it.**_


### Embeddings backend

Within Supabase:
- Create a Supabase account and project at https://app.supabase.com/sign-in
- Run this query Supabase's SQL editor:
    ```
    create extension vector;
    ```
- Create a table to store embeddings with this query:
    ```sql
    create table documents (
      id bigserial primary key,
      content text,
      url text,
      embedding vector (1536)
    );
    ```
- Add similarity search function with another query:
    ```sql
    create or replace function match_documents (
      query_embedding vector(1536),
      similarity_threshold float,
      match_count int
    )
    returns table (
      id bigint,
      content text,
      url text,
      similarity float
    )
    language plpgsql
    as $$
    begin
      return query
      select
        documents.id,
        documents.content,
        documents.url,
        1 - (documents.embedding <=> query_embedding) as similarity
      from documents
      where 1 - (documents.embedding <=> query_embedding) > similarity_threshold
      order by documents.embedding <=> query_embedding
      limit match_count;
    end;
    $$;
    ```

### Chat frontend

- NextJs styled with Tailwind CSS.
- Chats streamed using OpenAIStream `utils/OpenAIStream.ts` 

### Run app

```
npm run dev
```

Go to `http://localhost:3000`. You should be able to type and ask questions now. Done ✅ 


## 🚀 Next steps

- Larger website with all the SCOTUS cases?
- Data on US presidents and administrations?


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- BUILT WITH -->
## 🔧 Tools used
[![Next][Next]][Next-url]
[![OpenAI][OpenAI]][OpenAI-url]
[![Supabase][Supabase]][Supabase-url]
[![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
[![Vercel][Vercel]][Vercel-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## 👤 Contact

`me@vdutts7.com` 

🔗 Project Link: `https://github.com/vdutts7/constitutionGPT`

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Python]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Python-url]: https://www.python.org/

[Next]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/

[Langchain]: https://img.shields.io/badge/🦜🔗Langchain-DD0031?style=for-the-badge&color=<brightgreen>
[Langchain-url]: https://langchain.com/

[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=skyblue&color=0A192F
[TailwindCSS-url]: https://tailwindcss.com/

[OpenAI]: https://img.shields.io/badge/OpenAI%20ada--002%20GPT-0058A0?style=for-the-badge&logo=openai&logoColor=white&color=4aa481
[OpenAI-url]: https://openai.com/

[AssemblyAI]: https://img.shields.io/badge/Assembly_AI-DD0031?style=for-the-badge&logo=https://github.com/vdutts7/yt-ai-chat/public/assemblyai.png&color=blue
[AssemblyAI-url]: https://www.assemblyai.com/

[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/

[Pinecone]: https://img.shields.io/badge/Pinecone-FFCA28?style=for-the-badge&https://github.com/vdutts7/yt-ai-chat/public/pinecone.png&logoColor=black&color=white
[Pinecone-url]: https://www.pinecone.io/

[Supabase]: https://img.shields.io/badge/Supabase%20pgvector-FFCA28?style=for-the-badge&logo=Supabase&logoColor=49E879&color=black
[Supabase-url]: https://Supabase.com/

[Vercel]: https://img.shields.io/badge/Vercel-FFFFFF?style=for-the-badge&logo=Vercel&logoColor=white&color=black
[Vercel-url]: https://Vercel.com/
