declare const graphData: GraphView;
declare const React: {};

const view = document.querySelector('#view');

const obj = <div></div>;
console.log(obj);

if (view) {
  view.innerHTML = `<pre>${JSON.stringify(graphData, null, 2)}</pre>`;
}
