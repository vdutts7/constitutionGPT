<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://github.com/vdutts7/constitutionGPT/blob/main/public/favicon.png" alt="Logo" width="80" height="80">
    <img src="https://github.com/vdutts7/yt-chat-mkbhd/blob/main/public/openai.png" alt="Logo" width="67" height="67">

  
  </a>
  <h2 align="center">Constitution GPT </h2> <p align="center"> AI chat over the US Constitution 📜 💬 🇺🇸
<br /> <a href=https://constitution-gpt.vercel.app/>LINK</a>  </p> </div> <p align="center"> <img src="https://github.com/vdutts7/constitutionGPT/blob/main/public/screen-rec.gif"/> </p>  


## Table of Contents

<ol>
    <a href="#about">📝 About</a>
        <ul>
        </ul>
    <a href="#how-to-build">💻 How to build</a>
        <ul>
            <li><a href="#initial-setup">Initial setup</a></li>
            <li><a href="#embeddings-backend">Embeddings backend</a></li>
            <li><a href="#chat-frontend">Chat frontend</a></li>
            <li><a href="#run-app">Run app</a></li>
        </ul>
    <a href="#next-steps">🚀 Next steps</a> 
       <ul>
        </ul>
    <a href="#tools-used">🔧 Tools used</a>
        <ul>
        </ul>
    <a href="#contact">👤 Contact</a>
  </ol>

<br/>

## 📝About

Chat with the US Constitution. Combines pgvector embeddings (Supabase), OpenAI, and NextJs to provide frontend UI chat interface.

<br/>

## 💻How to Build

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

Create a Supabase account and project at [Supabase](https://app.supabase.com/sign-in):

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

- NextJs styled with Tailwind CSS
- Chats streamed using `OpenAIStream`. See `utils/OpenAIStream.ts` for details


## 🚀Next Steps

Use this project as a foundation and build on top of this!

💡 Ideas 💡

- Entire history of SCOTUS cases?
- Specific data for each US president + administration?
- Patriot Act? Chips Act?
- CIA, DEA, FDA, CDC, etc. + all the confusing docs on the .gov websites

## 🔧Tools Used

[![Next][next]][next-url]
[![OpenAI][openai]][openai-url]
[![Supabase][supabase]][supabase-url]
[![Tailwind CSS][tailwindcss]][tailwindcss-url]
[![Vercel][vercel]][vercel-url]

## 👤Contact

[![Email][email]][email-url]
[![Twitter][twitter]][twitter-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[next]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[langchain]: https://img.shields.io/badge/🦜🔗Langchain-DD0031?style=for-the-badge&color=<brightgreen>
[langchain-url]: https://langchain.com/
[tailwindcss]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=skyblue&color=0A192F
[tailwindcss-url]: https://tailwindcss.com/
[openai]: https://img.shields.io/badge/OpenAI_GPT--3.5-0058A0?style=for-the-badge&logo=openai&logoColor=white&color=4aa481
[openai-url]: https://openai.com/
[cheerio]: https://img.shields.io/badge/cheerio-DD0031?style=for-the-badge&logo=https://github.com/vdutts7/cs186-ai-chat/public/cheerio-logo.png&logoColor=white&color=db903c
[cheerio-url]: https://cheerio.js.org/
[typescript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org/
[supabase]: https://img.shields.io/badge/Supabase%20pgvector-FFCA28?style=for-the-badge&logo=Supabase&logoColor=49E879&color=black
[supabase-url]: https://Supabase.com/
[vercel]: https://img.shields.io/badge/Vercel-FFFFFF?style=for-the-badge&logo=Vercel&logoColor=white&color=black
[vercel-url]: https://Vercel.com/
[website]: https://img.shields.io/badge/🔗Website-7f18ff?style=for-the-badge
[website-url]: https://constitution-gpt.vercel.app/
[github]: https://img.shields.io/badge/💻Github-000000?style=for-the-badge
[github-url]: https://github.com/vdutts7/constitutionGPT/
[email]: https://img.shields.io/badge/me@vd7.io-FFCA28?style=for-the-badge&logo=Gmail&logoColor=00bbff&color=black
[email-url]: #
[twitter]: https://img.shields.io/badge/Twitter-FFCA28?style=for-the-badge&logo=Twitter&logoColor=00bbff&color=black
[twitter-url]: https://twitter.com/vdutts7/
