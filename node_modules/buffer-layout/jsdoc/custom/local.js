/**
    @overview Make references to local things local.
    @module plugins/local
    @author Michael Mathews <micmath@gmail.com>
    @author Peter A. Bigot <pab@pabigot.com>
    @see {@link https://github.com/jsdoc3/jsdoc/issues/101|issue #101}
 */

var thisModule = '',
    registry = {};

function reset() {
    thisModule = '';
    registry = {};
}

exports.defineTags = function(dictionary) {
    dictionary.defineTag('local', {
        onTagged: function(doclet, tag) {
            registry[tag.text] = true;
        }
    });
}

function buildRE(prefix, tag) {
    var pat = '(' + prefix + ')\\b(' + tag + ')\\b';
    return new RegExp(pat, 'g');
}

exports.handlers = {
    jsdocCommentFound: function(e) {
        if (thisModule) for (var local in registry) {
            /* Handle {@link local} => {@link module~local|local} (across EOL) */
            var re = new RegExp('({@link\\s*\\*?\\s*)\\b(' + local + '\\b[^|}]*)}', 'g');
            e.comment = e.comment.replace(re,
                                         '$1' + thisModule + '~$2\|$2}');

            /* Handle {local} => {thisModule~local}.  Brace reference
             * doesn't support providing alternative text. */
            e.comment = e.comment.replace(buildRE('{', local),
                                          '$1' + thisModule + '~$2');

            /* Handle `@cmd local` => `@cmd thisModule~local` for
             * certain commands (across EOL) */
            e.comment = e.comment.replace(buildRE('@(event|link|memberof|name)\\s*\\*?\\s*', local),
                                         '$1' + thisModule + '~$3');
        }
    },

    newDoclet: function(e) {
        if (e.doclet.kind === 'module') {
            thisModule = e.doclet.longname;
        }
        else {
            if (thisModule) for (var local in registry) {
                var augment;
                if (e.doclet.augments) {
                    for (var i = 0, len = e.doclet.augments.length; i < len; i++) {
                        augment = e.doclet.augments[i];
                        if (augment && augment.indexOf(local) === 0) {
                            e.doclet.augments[i] = thisModule+'~'+e.doclet.augments[i];
                        }
                    }
                }

                if (e.doclet.longname.indexOf(local) === 0) {
                    e.doclet.longname = thisModule+'~'+e.doclet.longname;
                }
            }
        }
    },
    fileComplete: function(e) {
        reset();
    }
};
