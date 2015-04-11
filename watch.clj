(require 'cljs.closure)

(cljs.closure/watch "src"
  {:main 'tic-tac-toe.core
   :output-to "out/main.js"})
