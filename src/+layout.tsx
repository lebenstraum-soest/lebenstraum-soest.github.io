import { html, LayoutFunction, LayoutFunctionArgs } from "book-binder";

const layout: LayoutFunction = ({ content }: LayoutFunctionArgs) => {
  return Promise.resolve(
    "<!DOCTYPE html>" +
    (
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
            <picture>
              <source srcset="logo_830w.jpg" media="(min-width: 769px)" />
              <source srcset="logo_343w.jpg" media="(max-width: 768px)" />
              <img
                id="logo"
                src="logo_830w.jpg"
                alt="LebensTraum-Soest e. V."
              />
            </picture>
          </header>
          <main class="">
            <div class="content">{content}</div>
          </main>
        </body>
      </html>
    )
  );
};

export default layout;
