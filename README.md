# **How to run**
Install simple http server (https://www.npmjs.com/package/http-server) and run index.html
---------------------

## **To Do**
* **Make it possible to add animations** (today we have fade-in effect, we need to have slide left-right as well)
  * Just put a varable in the begining of the file (the same way as THEME_COLOR), it should support 2 values: `fade-in-out`, `slide-left-right`, `slide-top-down`
* **Make it possible to stop animation**
  * When slider initialized, we need to put a global object into window (window.slider) for example, that object will be available and should has 2 methods:
    * continue (should run animation)
    * pause (should pause animation)


Do the work in a separate branch (for example `feature/{your-name}/animations`)
