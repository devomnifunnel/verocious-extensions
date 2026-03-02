define('NSeComm.CustomPageTitleSuffix.Main', [
], function NSeCommCustomPageTitleSuffixMain(
) {
    'use strict';

    var escapeRegex = function escapeRegex(string) {
        return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    return {
        mountToApp: function mountToApp(container) {
            var layout = container.getComponent('Layout');
            var environment = container.getComponent('Environment');
            var pageTitleConfiguration = environment ? environment.getConfig('extensions.pagetitlesuffix') : {};

            if (layout) {
                layout.on('afterShowContent', function afterShowContent() {
                    // select the target node
                    var target = document.querySelector('title');
                    // create an observer instance
                    var observer = new MutationObserver(function titleObserver() {
                        // WARNING! This is not SC compliant
                        var templateName = layout.application.getLayout().getCurrentView().getTemplateName();

                        var suffixAtEndRegex = new RegExp(
                            escapeRegex(pageTitleConfiguration.suffix) + '$'
                        );
                        var isTitleModified = suffixAtEndRegex.test(document.title);

                        switch (templateName) {
                        case 'cms_landing_page':
                            if (!isTitleModified && pageTitleConfiguration.pagetypes) {
                                document.title += ' ' + pageTitleConfiguration.suffix;
                            }
                            break;
                        default:
                            if (!isTitleModified) {
                                document.title += ' ' + pageTitleConfiguration.suffix;
                            }
                        }
                    });
                    // pass in the target node, as well as the observer options
                    observer.observe(target, {
                        subtree: true,
                        characterData: true,
                        childList: true
                    });
                });
            }
        }
    };
});
