import { u } from 'unist-builder';

const classNames = {
  'hint info': /^!&gt;|!>\s/,
  'hint warning': /^\?&gt;|\?>\s/,
  'hint error': /^x&gt;|x>\s/,
  'hint note': /^x&gt;|.>\s/,
};

const map = (tree: any, iteratee: any) => {
  const preorder = (node: any, index: any, parent: any) => {
    const newNode = iteratee(node, index, parent);

    if (Array.isArray(newNode.children)) {
      newNode.children = newNode.children.map((child: any, idx: any) => {
        return preorder(child, idx, node);
      });
    }

    return newNode;
  };

  return preorder(tree, null, null);
};

const transform = () => (tree: any) => {
  return map(tree, (node: any) => {
    const { children = [] } = node;
    if (node.type !== 'paragraph') {
      return node;
    }

    const [{ value, type }, ...siblings] = children;
    if (type !== 'text') {
      return node;
    }

    if (!Object.values(classNames).some(r => r.test(value))) {
      return node;
    }

    const result = Object.entries(classNames).find(([, r]) => {
      return r.test(value);
    });
    const className = result![0];
    const regexp = result![1];

    const newChild = {
      type,
      value: value.replace(regexp, ''),
    };

    const props = {
      data: {
        class: className,
        hProperties: {
          class: className,
        },
      },
    };

    return u('paragraph', props, [newChild, ...siblings]);
  });
};

export default transform;
