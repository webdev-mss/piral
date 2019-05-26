import * as React from 'react';
import {
  TiNode,
  TiKind,
  InterfaceRenderer,
  ModuleRenderer,
  EnumerationRenderer,
  TypeAliasRenderer,
  TypeLiteralRenderer,
  ObjectLiteralRenderer,
  VariableRenderer,
  FunctionRenderer,
} from './typeRenderers';

export interface TiProps {
  children: TiNode;
}

function render(node: TiNode) {
  switch (node.kind) {
    case TiKind.Root:
    case TiKind.ExternalModule:
      return <ModuleRenderer node={node} render={render} />;
    case TiKind.Interface:
      return <InterfaceRenderer node={node} render={render} />;
    case TiKind.Function:
      return <FunctionRenderer node={node} render={render} />;
    case TiKind.ObjectLiteral:
      return <ObjectLiteralRenderer node={node} render={render} />;
    case TiKind.Variable:
      return <VariableRenderer node={node} render={render} />;
    case TiKind.TypeLiteral:
      return <TypeLiteralRenderer node={node} render={render} />;
    case TiKind.TypeAlias:
      return <TypeAliasRenderer node={node} render={render} />;
    case TiKind.Enumeration:
      return <EnumerationRenderer node={node} render={render} />;
    default:
      return <span>{node.name}</span>;
  }
}

export const Ti: React.SFC<TiProps> = ({ children }) => {
  return render(children);
};