import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=be64523c"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=be64523c"; const StrictMode = __vite__cjsImport1_react["StrictMode"];
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=be64523c"; const createRoot = __vite__cjsImport2_reactDom_client["createRoot"];
import "/src/index.css";
import App from "/src/App.jsx";
import { Toaster } from "/src/components/ui/sonner.jsx";
import { Provider } from "/node_modules/.vite/deps/react-redux.js?v=be64523c";
import { persistStore } from "/node_modules/.vite/deps/redux-persist.js?v=be64523c";
import store from "/src/redux/store.js";
import { PersistGate } from "/node_modules/.vite/deps/redux-persist_integration_react.js?v=be64523c";
const persistor = persistStore(store);
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(StrictMode, { children: /* @__PURE__ */ jsxDEV(Provider, { store, children: /* @__PURE__ */ jsxDEV(PersistGate, { loading: null, persistor, children: [
    /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
      fileName: "C:/Users/rahel/Desktop/job portal/Frontend/src/main.jsx",
      lineNumber: 18,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV(Toaster, {}, void 0, false, {
      fileName: "C:/Users/rahel/Desktop/job portal/Frontend/src/main.jsx",
      lineNumber: 19,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/rahel/Desktop/job portal/Frontend/src/main.jsx",
    lineNumber: 17,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/rahel/Desktop/job portal/Frontend/src/main.jsx",
    lineNumber: 16,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "C:/Users/rahel/Desktop/job portal/Frontend/src/main.jsx",
    lineNumber: 15,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBaUJRO0FBakJSLFNBQVNBLGtCQUFrQjtBQUMzQixTQUFTQyxrQkFBa0I7QUFDM0IsT0FBTztBQUNQLE9BQU9DLFNBQVM7QUFDaEIsU0FBU0MsZUFBZTtBQUN4QixTQUFTQyxnQkFBZ0I7QUFDekIsU0FBU0Msb0JBQW9CO0FBRTdCLE9BQU9DLFdBQVc7QUFDbEIsU0FBU0MsbUJBQW1CO0FBRTVCLE1BQU1DLFlBQVlILGFBQWFDLEtBQUs7QUFFcENMLFdBQVdRLFNBQVNDLGVBQWUsTUFBTSxDQUFDLEVBQUVDO0FBQUFBLEVBQzFDLHVCQUFDLGNBQ0MsaUNBQUMsWUFBUyxPQUNSLGlDQUFDLGVBQVksU0FBUyxNQUFNLFdBQzFCO0FBQUEsMkJBQUMsU0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQUk7QUFBQSxJQUNKLHVCQUFDLGFBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFRO0FBQUEsT0FGVjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBR0EsS0FKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBS0EsS0FORjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBT0E7QUFDRiIsIm5hbWVzIjpbIlN0cmljdE1vZGUiLCJjcmVhdGVSb290IiwiQXBwIiwiVG9hc3RlciIsIlByb3ZpZGVyIiwicGVyc2lzdFN0b3JlIiwic3RvcmUiLCJQZXJzaXN0R2F0ZSIsInBlcnNpc3RvciIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RyaWN0TW9kZSB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY3JlYXRlUm9vdCB9IGZyb20gXCJyZWFjdC1kb20vY2xpZW50XCI7XG5pbXBvcnQgXCIuL2luZGV4LmNzc1wiO1xuaW1wb3J0IEFwcCBmcm9tIFwiLi9BcHAuanN4XCI7XG5pbXBvcnQgeyBUb2FzdGVyIH0gZnJvbSBcIi4vY29tcG9uZW50cy91aS9zb25uZXJcIjtcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSBcInJlYWN0LXJlZHV4XCI7XG5pbXBvcnQgeyBwZXJzaXN0U3RvcmUgfSBmcm9tIFwicmVkdXgtcGVyc2lzdFwiO1xuXG5pbXBvcnQgc3RvcmUgZnJvbSBcIi4vcmVkdXgvc3RvcmVcIjtcbmltcG9ydCB7IFBlcnNpc3RHYXRlIH0gZnJvbSBcInJlZHV4LXBlcnNpc3QvaW50ZWdyYXRpb24vcmVhY3RcIjtcblxuY29uc3QgcGVyc2lzdG9yID0gcGVyc2lzdFN0b3JlKHN0b3JlKTtcblxuY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikpLnJlbmRlcihcbiAgPFN0cmljdE1vZGU+XG4gICAgPFByb3ZpZGVyIHN0b3JlPXtzdG9yZX0+XG4gICAgICA8UGVyc2lzdEdhdGUgbG9hZGluZz17bnVsbH0gcGVyc2lzdG9yPXtwZXJzaXN0b3J9PlxuICAgICAgICA8QXBwIC8+XG4gICAgICAgIDxUb2FzdGVyIC8+XG4gICAgICA8L1BlcnNpc3RHYXRlPlxuICAgIDwvUHJvdmlkZXI+XG4gIDwvU3RyaWN0TW9kZT5cbik7Il0sImZpbGUiOiJDOi9Vc2Vycy9yYWhlbC9EZXNrdG9wL2pvYiBwb3J0YWwvRnJvbnRlbmQvc3JjL21haW4uanN4In0=