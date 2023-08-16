import { useEffect } from "react";

export function useKey(key, action) {
  //Close Movie details on 'ESC'.
  useEffect(
    function () {
      function callBack(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }

      document.addEventListener("keydown", callBack);

      return function () {
        document.removeEventListener("keydown", callBack);
      };
    },
    [action]
  );
}
