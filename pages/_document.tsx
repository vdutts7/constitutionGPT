import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="backdrop-hue-rotate-60 bg-gradient-to-r from-red-700 via-white to-blue-700 bg-no-repeat bg-cover">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
