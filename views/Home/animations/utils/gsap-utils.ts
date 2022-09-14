/** Given an array of DOM HTML elements nodes, return an array of all children of nodes. */
export const getChildren = (nodes: Element[]) => {
  return nodes.reduce(
    (acc, curr) => [...acc, ...Array.from(curr.children)],
    [] as Element[]
  );
}

/** Function used to delay some operation. */
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
