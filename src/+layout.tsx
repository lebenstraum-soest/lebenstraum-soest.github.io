import { html, LayoutFunction, LayoutFunctionArgs } from "book-binder";

const layout: LayoutFunction = ({ content }: LayoutFunctionArgs) => {
  return Promise.resolve(
    <html>
      <head>
        <title>LebensTraum-Soest e. V.</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
      </head>
      <body>
        <header class="container mb-6">
          <img id="logo" src="logo.png" alt="LebensTraum-Soest e. V." />
        </header>
        <main class="container">
          <div class="content">{content}</div>
        </main>
      </body>
    </html>
  );
};

export default layout;
