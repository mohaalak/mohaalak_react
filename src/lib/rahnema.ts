export type MElement = {
  type: string;
  children: MElement[];
  props: Record<string, any>;
};
export const createElement = (
  type: string,
  props?: Record<string, any>,
  ...children: Array<MElement | string>
): MElement => {
  return {
    type,
    props: props ?? {},
    children: children
      .flatMap((x) => (Array.isArray(x) ? x : [x]))
      .map((x) =>
        typeof x === "string"
          ? { type: "TEXT ELEMENT", props: { nodeValue: x }, children: [] }
          : x
      ),
  };
};

export default { createElement };
