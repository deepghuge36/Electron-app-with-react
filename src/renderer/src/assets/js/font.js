// font-loader.js

// Create a <style> element
const style = document.createElement('style')
style.type = 'text/css'

// Define the @font-face CSS rule
const fontFace = `
@font-face {
  font-family: 'SamsungOne';
  src: url('../font/SamsungOne-400_v1.1.woff') format('woff'),
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Samsung Sharp Sans';
  src: url('../font/SamsungSharpSans-Regular.woff') format('woff'),
  font-weight: normal;
  font-style: normal;
}


@font-face {
  font-family: 'Samsung Sharp Sans Medium';
  src: url('../font/SamsungSharpSans-Medium.woff') format('woff'),
  font-weight: normal;
  font-style: normal;
}


@font-face {
  font-family: 'Samsung Sharp Sans Bold';
  src: url('../font/SamsungSharpSans-Bold.woff') format('woff'),
  font-weight: normal;
  font-style: normal;
}

.body{
  font-family: 'SamsungOne',"Arial", sans-serif;
}


:root {
--Color/Token_Text/Text_Sub:#A3A8B3;
    --font-inter: SamsungOne;
    --font-samsung-sharp-sans: 'Samsung Sharp Sans Bold';
    /* font sizes */
    --font-size-xs: 12px;
    --font-size-base: 16px;
    --font-size-4xs: 9px;
    --font-size-smi-2: 12.2px;
    --font-size-lg-3: 18.3px;
    /* Colors */
    --color-white: #fff;
    --color-steelblue-100: #718ebf;
    --color-steelblue-200: #445586;
    --color-steelblue-300: rgba(113, 142, 191, 0);
    --color-whitesmoke-100: #f5f7fa;
    --color-whitesmoke-200: rgba(1, 1, 1, 0.5);
    --color-lavender-100: #e3e8f2;
    --color-gray-100: #898989;
    --color-hotpink-100: #de5eaa;
    --color-hotpink-90: #ea9dcc;
    --color-cornflowerblue-100: #6fa2f7;
    --color-salmon-100: #f05d5d;
    --color-dimgray: #53565c;
    --color-midnightblue: #250d4a;
    --color-darkslategray: #434343;
    --color-black: #000;
}
`

export default fontFace

// // Add the CSS rule to the <style> element
// style.appendChild(document.createTextNode(fontFace))

// // Append the <style> element to the document's <head>
// document.head.appendChild(style)
