//https://github.com/zkat/pacote

const CARET_BRACES = '^{}';
const REFS_TAGS = 'refs/tags/';
const REFS_HEADS = 'refs/heads/';
const HEAD = 'HEAD';
function refType(ref : string) {
  return ref.indexOf(REFS_TAGS) !== -1
    ? 'tag'
    : ref.indexOf(REFS_HEADS) !== -1
      ? 'branch'
      : ref.endsWith(HEAD)
        ? 'head'
        : 'other';
}

export interface IRevs {
  versions : any,
  'dist-tags' : any,
  refs : any,
  shas : any
}

export function revsParse(stdout : string):IRevs {
  return stdout
    .split('\n')
    .reduce((revs :IRevs, line) => {
      const split = line.split(/\s+/, 2);
      if (split.length < 2) {
        return revs;
      }
      const sha = split[0].trim();
      const ref = split[1]
        .trim()
        .match(/(?:refs\/[^/]+\/)?(.*)/)[1];
      if (!ref) {
        return revs;
      } // ???
      if (ref.endsWith(CARET_BRACES)) {
        return revs;
      } // refs/tags/x^{} crap
      const type = refType(line);
      const doc = {
        sha,
        ref,
        type
      };

      revs.refs[ref] = doc;
      // We can check out shallow clones on specific SHAs if we have a ref
      if (revs.shas[sha]) {
        revs
          .shas[sha]
          .push(ref);
      } else {
        revs.shas[sha] = [ref];
      }

      if (type === 'tag') {
        const match = ref.match(/v?(\d+\.\d+\.\d+)$/);
        if (match) {
          revs.versions[match[1]] = doc;
        }
      }
      return revs;
    }, {
      versions: {},
      'dist-tags': {},
      refs: {},
      shas: {}
    });
}
