/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define('NSeComm.LiveChat.Main', [],
function NSeCommLiveChatMain(
) {
    'use strict';

    return {
        mountToApp: function mountToApp(container) {
            var self = this;
            var environment = container.getComponent('Environment');
            var layout = container.getLayout();
            layout.once('afterAppendView', function afterAppendView() {

                if ('requestIdleCallback' in window) {
                    requestIdleCallback(function() {
                        setTimeout(function() { 
                            self.loadSlaask(
                                environment.getConfig('liveChat.slaaskKey'),
                                environment.getConfig('liveChat.slaaskUrl')
                            );
                        }, 3000);
                    });
                } else {
                    setTimeout(function() { 
                        self.loadSlaask(
                            environment.getConfig('liveChat.slaaskKey'),
                            environment.getConfig('liveChat.slaaskUrl')
                        ); 
                    }, 5000);
                }
            });
        },

        loadSlaask: function loadSlaask(key, scriptUrl) {
            var script = document.createElement('script');
            // eslint-disable-next-line no-underscore-dangle
            window._slaaskSettings = {
                key: key
            };

            script.src = scriptUrl;
            script.async = true;

            document.head.appendChild(script);
        }
    };
});
