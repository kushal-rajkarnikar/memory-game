 function RingToneService() {
            var _this = this;
            _this.loadRingTone = function (url) {
                return new Howl({
                    src: [url],
                    loop: true
                });
            };
        }