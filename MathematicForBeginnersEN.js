/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "MathematicForBeginners",
                "name": "数学入門",
                "color1": "#6691cc",
                "color2": "#335e99",
                "tbShow": true,
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `s_to_g`,
        blockType: Scratch.BlockType.REPORTER,
        text: `The sum of numbers from [S] to [G]`,
        arguments: {
            "S": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "G": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`s_to_g`] = (args, util) => {
        return ((((args["G"] - args["S"]) + 1) * (args["G"] + args["S"])) / 2)
    };

    blocks.push({
        opcode: `eorbigger`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[A]≤[B]`,
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`eorbigger`] = (args, util) => {
        return ((args["A"] == args["B"]) || (args["B"] > args["A"]))
    };

    blocks.push({
        opcode: `eorsmaller`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[A]≥[B]`,
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`eorsmaller`] = (args, util) => {
        return ((args["A"] == args["B"]) || (args["A"] > args["B"]))
    };

    blocks.push({
        opcode: `equal`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[A]=[B]`,
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`equal`] = (args, util) => {
        return (args["A"] == args["B"])
    };

    blocks.push({
        opcode: `notequal`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[A]≠[B]`,
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`notequal`] = (args, util) => {
        return !(args["A"] == args["B"])
    };

    blocks.push({
        opcode: `bigger2`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[A]<[B]<[C]`,
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
            "C": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`bigger2`] = (args, util) => {
        return ((args["A"] < args["B"]) && (args["B"] < args["C"]))
    };

    blocks.push({
        opcode: `eorbigger2`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[A]≤[B]≤[C]`,
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
            "C": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`eorbigger2`] = (args, util) => {
        return (((args["A"] == args["B"]) || (args["A"] < args["B"])) && ((args["B"] == args["C"]) || (args["B"] < args["C"])))
    };

    blocks.push({
        opcode: `true`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `true`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`true`] = (args, util) => {
        return true
    };

    blocks.push({
        opcode: `false`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `false`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`false`] = (args, util) => {
        return false
    };

    Scratch.extensions.register(new Extension());
})(Scratch);