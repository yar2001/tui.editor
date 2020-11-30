import { Parser } from '../../blocks';
import { createRenderHTML, HTMLConvertorMap } from '../../../html/render';
import { source } from 'common-tags';

const convertors: HTMLConvertorMap = {
  myCustom(node) {
    return [
      { type: 'openTag', tagName: 'div', outerNewLine: true, classNames: ['myCustom-block'] },
      { type: 'html', content: node.literal! },
      { type: 'closeTag', tagName: 'div', outerNewLine: true }
    ];
  }
};
const reader = new Parser();
const render = createRenderHTML({ gfm: true, convertors });

describe('customBlock', () => {
  it('basic', () => {
    const input = source`
      {{myCustom
        my custom block

        should be parsed
      }}
    `;
    const output = source`
      <div class="myCustom-block">  my custom block

        should be parsed
      </div>
    `;

    const root = reader.parse(input);
    const html = render(root);
    expect(html).toBe(`${output}\n`);
  });

  it('fallback', () => {
    const input = source`
      {{custom
        custom block
      }}
    `;
    const output = source`
      <div>  custom block
      </div>
    `;

    const root = reader.parse(input);
    const html = render(root);
    expect(html).toBe(`${output}\n`);
  });

  it('should be parsed as paragraph without meta information', () => {
    const input = source`
      {{
        custom block
      }}
    `;
    const output = source`
      <p>{{
      custom block
      }}</p>
    `;

    const root = reader.parse(input);
    const html = render(root);
    expect(html).toBe(`${output}\n`);
  });
});
