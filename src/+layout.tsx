import { html, LayoutFunction, LayoutFunctionArgs } from "book-binder";

const layout: LayoutFunction = ({ content }: LayoutFunctionArgs) => {
  return Promise.resolve(
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <meta name="description" content="" />
        <meta name="author" content="Klaus Tappesser" />
        <title>LebensTraum-Soest e. V.</title>
        <link rel="stylesheet" type="text/css" href="style.css" />
      </head>
      <body class="container is-centered">
        <div class="stripe"></div>
        <header class="mb-6">
          <img
            id="logo"
            srcset="logo_343w.jpg 343w, logo_830w.jpg 830w"
            sizes="(max-width: 768px) 343px, 830px"
            src="logo_830w.jpg"
            alt="LebensTraum-Soest e. V."
          />
        </header>
        <main class="">
          <div class="content">{content}</div>
        </main>
      </body>
    </html>
  );
};

export default layout;
