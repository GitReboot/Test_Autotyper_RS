<template>
    <div class="flex flex-col h-full w-full bg-gradient-to-br from-blue-900/20 to-blue-900/20 text-white font-inter rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-6 py-3 bg-blue-900/10 border-b border-blue-900/20 draggable">
            <h2 class="text-sm font-light select-none">AutoHyper</h2>
            <div class="flex items-center gap-4">
                <div @click="minimizeWindow()" class="flex items-center justify-center rounded-full bg-black/20 hover:bg-blue-900 text-gray-500 p-1 -m-1 hover:text-white transition ease duration-200 no-drag cursor-pointer">
                    <i class="bx bx-minus"></i>
                </div>
                <div @click="closeWindow()" class="flex items-center justify-center rounded-full bg-black/20 hover:bg-blue-900 text-gray-500 p-1 -m-1 hover:text-white transition ease duration-200 no-drag cursor-pointer">
                    <i class="bx bx-x"></i>
                </div>
            </div>
        </div>
        <div class="flex flex-col flex-grow relative">
            <div class="absolute top-0 right-0 bottom-0 left-0 z-50 backdrop-blur transition ease duration-200" :class="{
                'opacity-0 pointer-events-none': !openMessagesModalOpen
            }">
                <div class="flex flex-col h-full items-center justify-center" v-if="messageLists.length > 0">
                    <div class="flex flex-col w-2/3 bg-slate-900 rounded-lg border border-b-2 border-blue-900/20">
                        <div class="flex items-center justify-between px-6 py-4 border-b border-blue-900/20">
                            <h2 class="text-sm font-light">Open Message List</h2>
                            <i @click="openMessagesModalOpen = false" class="bx bx-x text-gray-500 hover:text-white cursor-pointer transition ease duration-200 p-4 -m-4"></i>
                        </div>
                        <div class="flex flex-col divide-y divide-blue-900/10 min-h-[200px] max-h-[200px] overflow-y-auto">
                            <div @click="openMessageList(list)" class="flex items-center justify-between px-6 py-2.5 hover:bg-blue-900/10 text-gray-400 hover:text-white cursor-pointer text-xs select-none transition ease duration-200 group" v-for="list in messageLists">
                                <h2>{{ list.title }}</h2>
                                <i @click.stop="deleteMessageList(list.title)" class="bx bx-trash opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition ease duration-200 p-2 -m-2"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute top-0 right-0 bottom-0 left-0 z-50 backdrop-blur transition ease duration-200" :class="{
                'opacity-0 pointer-events-none': !settingsOpen
            }">
                <div class="flex flex-col h-full items-center justify-center">
                    <div class="flex flex-col w-2/3 bg-slate-900 rounded-lg border border-b-2 border-blue-900/20">
                        <div class="flex items-center justify-between px-6 py-4 border-b border-blue-900/20">
                            <h2 class="text-sm font-light">AutoHyper Settings</h2>
                            <i @click="settingsOpen = false" class="bx bx-x text-gray-500 hover:text-white cursor-pointer transition ease duration-200 p-4 -m-4"></i>
                        </div>
                        <div class="flex flex-col gap-2 px-6 py-3">
                            <div class="flex items-center justify-between gap-6">
                                <h2 class="text-xs w-[170px] shrink-0">Target Window</h2>
                                <div class="flex flex-col relative flex-grow">
                                    <div @click="toggleTargetWindowDropdown()" class="flex items-center justify-between text-xs bg-black/20 px-4 py-2 border border-b-2 border-blue-900/20 rounded-lg cursor-pointer hover:bg-black/40 transition ease duration-200 select-none overflow-hidden">
                                        <h2 v-if="targetWindow" class="truncate">{{ targetWindow.mainWindowTitle }}</h2>
                                        <h2 v-else>No window selected</h2>
                                    </div>
                                    <div class="flex flex-col absolute z-50 w-full top-full mt-1 bg-slate-900 rounded-lg border border-b-2 border-blue-900/40 divide-y divide-blue-900/10 transition ease duration-200 max-h-[200px] overflow-y-auto" v-if="!loadingOpenApps" :class="{
                                        'opacity-0 pointer-events-none scale-75 rotate-6': !targetWindowDropdownOpen
                                    }">
                                        <h2 @click="setTargetWindow(app)" v-for="app in openApps" :key="app.pid" class="text-xs px-4 py-2 text-gray-500 hover:text-white cursor-pointer transition ease duration-200 select-none">{{ app.mainWindowTitle }}</h2>
                                    </div>
                                    <div v-else class="flex flex-col items-center justify-center absolute z-50 w-full top-full mt-1 bg-slate-900 rounded-lg border border-b-2 border-blue-900/40 h-[200px] overflow-y-auto transition ease duration-200 select-none" :class="{
                                        'opacity-0 pointer-events-none scale-75 rotate-6': !targetWindowDropdownOpen
                                    }">
                                        <i class="bx bx-loader-dots animate-spin text-blue-900/80 text-5xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <h2 class="text-xs text-gray-500">If the target window is not focused, the autotyper will pause until the target window is re-focused.</h2>
                            </div>
                            <div class="flex items-center justify-between gap-6">
                                <h2 class="text-xs w-[170px] shrink-0">Minimum Delay (s)</h2>
                                <input type="number" v-model="minDelay" @input="updateMinDelay()" class="w-[100px] text-xs bg-black/20 px-4 py-2 border border-b-2 border-blue-900/20 rounded-lg hover:bg-black/40 transition ease duration-200 select-none outline-none">
                            </div>
                            <div class="flex items-center justify-between gap-6">
                                <h2 class="text-xs w-[170px] shrink-0">Maximum Delay (s)</h2>
                                <input type="number" v-model="maxDelay" @input="updateMaxDelay()" class="w-[100px] text-xs bg-black/20 px-4 py-2 border border-b-2 border-blue-900/20 rounded-lg hover:bg-black/40 transition ease duration-200 select-none outline-none">
                            </div>
                            <div class="flex items-center justify-center mt-4">
                                <h2 class="flex items-center gap-1 text-[10px] text-gray-300">Made with <i class="bx bxs-heart animate-pulse text-red-500" :style="{ WebkitTextFillColor: 'red'}"></i> by <strong class="text-white font-light tracking-wider">kaiii</strong></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute top-0 right-0 bottom-0 left-0 z-50 backdrop-blur transition ease duration-200" :class="{
                'opacity-0 pointer-events-none': !saveMessagesModalOpen
            }">
                <div class="flex flex-col h-full items-center justify-center">
                    <div class="flex flex-col w-2/3 bg-slate-900 rounded-lg border border-b-2 border-blue-900/20">
                        <div class="flex items-center justify-between px-6 py-4 border-b border-blue-900/20">
                            <h2 class="text-sm font-light">Saving Message List</h2>
                            <i @click="saveMessagesModalOpen = false" class="bx bx-x text-gray-500 hover:text-white cursor-pointer transition ease duration-200 p-4 -m-4"></i>
                        </div>
                        <div class="flex flex-col gap-2 px-6 py-3">
                            <div class="flex flex-col gap-2">
                                <input type="text" placeholder="Title" v-model="saveMessagesTitle" class="flex-grow text-xs bg-black/20 px-4 py-2 border border-b-2 border-blue-900/20 rounded-lg hover:bg-black/40 hover:border-blue-900/40 focus:bg-black/40 focus:border-blue-900/40 transition ease duration-200 select-none outline-none">
                            </div>
                            <button @click="saveMessages(true)" class="px-6 py-2 text-gray-400 bg-blue-900/20 rounded-lg border border-b-2 border-blue-900/40 text-sm hover:text-white hover:bg-blue-900/40 hover:border-blue-900/60 transition ease duration-200 outline-none">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute top-0 right-0 bottom-0 left-0 z-50 backdrop-blur transition ease duration-200" :class="{
                'opacity-0 pointer-events-none': !newMessageModalOpen
            }">
                <div class="flex flex-col h-full items-center justify-center">
                    <div class="flex flex-col gap-2 w-1/2 bg-slate-900 rounded-lg border border-b-2 border-blue-900/20">
                        <div class="flex items-center justify-between px-6 py-4 border-b border-blue-900/20">
                            <h2 class="text-sm font-light">Adding New Messages</h2>
                            <i @click="newMessageModalOpen = false" class="bx bx-x text-gray-500 hover:text-white cursor-pointer transition ease duration-200 p-4 -m-4"></i>
                        </div>
                        <div class="flex flex-col h-[100px] relative px-6 pt-2">
                            <textarea v-model="newMessage" placeholder="Type your message here..." class="w-full h-full resize-none border border-b-2 border-blue-900/20 rounded-lg bg-black/20 hover:border-blue-900/40 focus:border-blue-900/40 placeholder:text-gray-500 text-xs focus:shadow outline-none transition ease duration-200 p-4"></textarea>
                            <h2 class="absolute bottom-2 right-8 text-xs" :class="{
                                'text-red-500 font-semibold animate-pulse': newMessageLength > 80,
                                'text-gray-500': newMessageLength <= 80
                            }">{{ newMessageLength }}/80</h2>
                        </div>
                        <div class="flex flex-col px-6 pb-4">
                            <button @click="addMessage()" class="px-6 py-3 text-gray-400 bg-blue-900/20 rounded-lg border border-b-2 border-blue-900/40 text-xs hover:text-white hover:bg-blue-900/40 hover:border-blue-900/60 transition ease duration-200 outline-none" :class="{
                                'cursor-not-allowed': newMessageLength > 80
                            }">
                                Add Message
                            </button>
                        </div>
                    </div>
                    <h2 class="text-gray-300 text-xs mt-4 select-none">Press escape to close</h2>
                </div>
            </div>
            <div class="flex flex-col flex-grow relative">
                <div class="flex items-center justify-between px-6 py-3">
                    <div class="flex flex-col">
                        <h2 class="font-semibold">Message Queue</h2>
                        <div class="flex items-center gap-1">
                            <h2 class="text-xs text-gray-500" :class="{ 'italic': title === null }">{{ title || 'New List' }}</h2>
                            <h2 v-if="hasChangesToList" class="text-xs text-red-500 animate-pulse"><i class="bx bx-save relative top-[2px]"></i></h2>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="running ? null : newMessageList()" v-if="title !== null" class="flex items-center gap-3 px-4 py-2 rounded-lg outline-none bg-blue-900/5 border border-b-2 border-blue-900/20 text-gray-400 transition ease duration-200 select-none text-xs" :class="{
                            'cursor-not-allowed relative group opacity-80 text-gray-700': running,
                            'cursor-pointer hover:text-white hover:bg-blue-900/10 hover:border-blue-900/40 ': !running
                        }">
                            <h2 class="absolute w-full top-full mt-1 border border-b-2 border-blue-900/20 rounded-lg left-0 bg-gray-900 text-xs z-10 p-2 opacity-0 scale-75 rotate-3 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 transition ease duration-200" v-if="running">Not while running</h2>
                            <i class="bx bx-plus"></i>
                            <h2>New</h2>
                        </button>
                        <button @click="running ? null : openMessagesModal()" v-if="messageLists.length > 0" class="flex items-center gap-3 px-4 py-2 rounded-lg outline-none bg-blue-900/5 border border-b-2 border-blue-900/20 text-gray-400 transition ease duration-200 select-none text-xs" :class="{
                            'cursor-not-allowed relative group opacity-80 text-gray-700': running,
                            'cursor-pointer hover:text-white hover:bg-blue-900/10 hover:border-blue-900/40 ': !running
                        }">
                            <h2 class="absolute w-full top-full mt-1 border border-b-2 border-blue-900/20 rounded-lg left-0 bg-gray-900 text-xs z-10 p-2 opacity-0 scale-75 rotate-3 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 transition ease duration-200" v-if="running">Not while running</h2>
                            <i class="bx bx-folder-open"></i>
                            <h2>Open</h2>
                        </button>
                        <button @click="saveMessages()" v-if="title !== null && messages.length > 0" class="flex items-center gap-3 px-4 py-2 rounded-lg outline-none bg-blue-900/5 border border-b-2 border-blue-900/20 text-gray-400 hover:text-white hover:bg-blue-900/10 hover:border-blue-900/40 transition ease duration-200 cursor-pointer select-none text-xs">
                            <i class="bx bx-save"></i>
                            <h2>Save</h2>
                        </button>
                        <button @click="openSaveMessagesModal()" v-if="messages.length > 0" class="flex items-center gap-3 px-4 py-2 rounded-lg outline-none bg-blue-900/5 border border-b-2 border-blue-900/20 text-gray-400 hover:text-white hover:bg-blue-900/10 hover:border-blue-900/40 transition ease duration-200 cursor-pointer select-none text-xs">
                            <i class="bx bx-save"></i>
                            <h2 v-if="title === null">Save</h2>
                            <h2 v-else>Save As</h2>
                        </button>
                        <button @click="toggleSettings()" class="flex items-center gap-3 px-4 py-2 h-[35px] rounded-lg outline-none bg-blue-900/5 border border-b-2 border-blue-900/20 text-gray-400 hover:text-white hover:bg-blue-900/10 hover:border-blue-900/40 transition ease duration-200 cursor-pointer select-none text-xs">
                            <i class="bx bx-cog"></i>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col flex-grow divide-y divide-blue-900/10 bg-blue-900/5 border border-b-0 border-blue-900/20 rounded-t-lg overflow-y-auto max-h-[282px] mx-6" v-if="messages.length > 0">
                    <div class="flex items-center px-4 py-2 text-gray-500 hover:text-white relative group transition ease duration-200" v-for="(message, index) in messages" :key="index" :class="{
                        'hover:bg-blue-900/5': editingMessage !== index,
                        'bg-blue-900/10': editingMessage === index
                    }">
                        <i class="bx bx-loader-dots animate-spin mr-3" v-if="running && messageIndex < index"></i>
                        <i class="bx bx-check text-green-500 mr-3" v-if="running && messageIndex > index"></i>
                        <h2 class="text-xs w-[28px]" v-if="running && messageIndex === index">{{ ((nextTick - tick) / 1000).toFixed(1) }}</h2>
                        <input :id="'message-input-' + index" type="text" v-model="editingMessageValue" v-if="editingMessage === index" class="w-full bg-transparent outline-none text-sm text-white transition ease duration-200"></input>
                        <h2 v-else class="text-sm">{{ message }}</h2>
                        <div class="flex items-center gap-2 absolute right-2" v-if="editingMessage !== index">
                            <div @click="editMessage(index)" class="flex items-center justify-center h-[30px] w-[30px] opacity-0 cursor-pointer group-hover:opacity-100 text-gray-500 hover:text-white transition ease duration-200">
                                <i class="bx bx-pencil"></i>
                            </div>
                            <div @click="deleteMessage(index)" class="flex items-center justify-center h-[30px] w-[30px] opacity-0 cursor-pointer group-hover:opacity-100 text-gray-500 hover:text-white transition ease duration-200">
                                <i class="bx bx-trash"></i>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 absolute right-2" v-else>
                            <div @click="cancelEditMessage(index)" class="flex items-center justify-center h-[30px] w-[30px] cursor-pointer text-gray-500 hover:text-white transition ease duration-200">
                                <i class="bx bx-x"></i>
                            </div>
                            <div @click="saveMessage(index)" class="flex items-center justify-center h-[30px] w-[30px] cursor-pointer text-gray-500 hover:text-white transition ease duration-200">
                                <i class="bx bx-save"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-6">
                    <button @click="newMessageModalOpen = true" class="w-full px-4 py-3 mt-auto bg-blue-900/5 border border-blue-900/20 rounded-b-lg text-gray-400 text-sm hover:text-white hover:bg-blue-900/10 cursor-pointer select-none transition ease duration-200 outline-none" v-if="messages.length > 0">
                        <h2>Add Messages</h2>
                    </button>
                </div>
                <div @click="newMessageModalOpen = true" class="flex flex-col gap-3 items-center justify-center flex-grow bg-blue-900/5 border border-b-2 border-blue-900/20 text-gray-500 hover:text-gray-300 rounded-lg mx-6 cursor-pointer select-none transition ease duration-200" v-if="messages.length === 0">
                    <div class="flex flex-col items-center justify-center text-center gap-1">
                        <i class="bx bx-dots-horizontal-rounded text-white text-5xl"></i>
                        <h2 class="text-sm text-white font-medium">Message list is empty</h2>
                        <h2 class="text-xs">Click here to add a message</h2>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-4 justify-between px-6 py-3 overflow-hidden">
                <div class="flex items-center gap-3 shrink-0">
                    <button @click="start()" class="flex items-center gap-3 text-sm px-4 py-2 h-[39px] bg-blue-900/5 hover:bg-blue-900/10 transition ease duration-200 rounded-lg border border-b-2 border-blue-900/20" v-if="!this.running && this.messages.length > 0">
                        <i class="bx bx-play"></i>
                    </button>
                    <div class="flex items-center gap-3 text-sm px-4 py-2 h-[39px] bg-blue-900/20 rounded-lg border border-b-2 border-blue-900/20" v-if="this.running">
                        <i class="bx bx-loader-dots" :class="{
                            'animate-spin': this.running && !this.paused
                        }"></i>
                    </div>
                    <button @click="pause()" class="flex items-center gap-3 text-sm px-4 py-2 h-[39px] rounded-lg border border-b-2 border-blue-900/20 bg-blue-900/5 hover:bg-blue-900/10 transition ease duration-200 outline-none" v-if="(this.running && !this.paused) || this.autoPaused">
                        <i class="bx bx-pause"></i>
                    </button>
                    <button @click="resume()" class="flex items-center gap-3 text-sm px-4 py-2 h-[39px] rounded-lg border border-b-2 border-blue-900/20 bg-blue-900/5 hover:bg-blue-900/10 transition ease duration-200 outline-none" v-if="this.running && this.paused && !this.autoPaused">
                        <i class="bx bx-play"></i>
                    </button>
                    <button @click="stop()" class="flex items-center gap-3 text-sm px-4 py-2 h-[39px] rounded-lg border border-b-2 border-blue-900/20 bg-blue-900/5 hover:bg-blue-900/10 transition ease duration-200 outline-none" v-if="this.running">
                        <i class="bx bx-stop"></i>
                    </button>
                    <!-- <h2>hey hey hey</h2> -->
                </div>

                <div class="flex items-center gap-2 rounded-lg border border-b-2 border-blue-900/20 px-4 bg-blue-900/5 h-[39px] text-xs select-none overflow-hidden max-w-[300px]" v-if="activeWindow && targetWindow">
                    <div class="w-[10px] h-[10px] shrink-0 rounded-full" :class="{
                        'bg-red-500': targetWindow?.pid !== activeWindow?.pid,
                        'bg-green-500': targetWindow?.pid === activeWindow?.pid
                    }"></div>
                    <h2 class="truncate">{{ activeWindow?.title }}</h2>
                </div>
                <div @click="settingsOpen = true" v-else-if="!targetWindow" class="flex items-center gap-3 text-xs text-gray-500 border border-b-2 border-blue-900/20 rounded-lg bg-blue-900/5 px-4 h-[39px] cursor-pointer select-none">
                    <i class="bx bx-badge-exclamation text-red-500"></i>
                    <h2 class="text-red-500">No target window</h2>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
		name: 'App',
        data() {
            return {
                loadingOpenApps: false,
                openApps: null,
                activeWindow: null,
                knownActiveWindow: null,
                activeWindowInterval: null,
                title: null,
                messages: [],
                loadedMessages: [],
                editingMessage: null,
                editingMessageValue: "",
                settingsOpen: false,
                targetWindowDropdownOpen: false,
                newMessageModalOpen: false,
                newMessage: "",
                targetWindow: null,
                saveMessagesModalOpen: false,
                saveMessagesTitle: '',
                openMessagesModalOpen: false,

                messageLists: [],

                running: false,
                paused: false,
                autoPaused: false,
                pauseDuration: 0,
                pausedAt: null,
                tick: 0,
                messageIndex: 0,
                nextTick: null,
                tickInterval: null,
                minDelay: 8,
                maxDelay: 14,
            }
        },
        async mounted() {
            this.openApps = await window.electronAPI.getOpenApplications();
            this.activeWindow = await window.electronAPI.getActiveWindow();
            this.messageLists = await window.electronAPI.getMessageLists();
            this.minDelay = await window.electronAPI.getMinDelay();
            this.maxDelay = await window.electronAPI.getMaxDelay();

            this.activeWindowInterval = setInterval(async () => {
                this.activeWindow = await window.electronAPI.getActiveWindow();
            }, 1);

            document.addEventListener('keydown', this.handleKeyDown);
            window.electronAPI.disableZoom();
        },
        beforeUnmount() {
            clearInterval(this.activeWindowInterval);
            clearInterval(this.tickInterval);
            document.removeEventListener('keydown', this.handleKeyDown);
        },
        methods: {
            editMessage(index) {
                this.editingMessage = index;
                this.editingMessageValue = this.messages[index];
                this.$nextTick(() => {
                    document.getElementById('message-input-' + index).focus();
                });
            },
            cancelEditMessage() {
                this.editingMessage = null;
                this.editingMessageValue = "";
            },
            saveMessage(index) {
                this.messages[index] = this.editingMessageValue;
                this.editingMessage = null;
                this.editingMessageValue = "";
            },
            addMessage() {
                if(this.newMessage.trim().length > 0 && this.newMessageLength <= 80) {
                    this.messages.push(this.newMessage.trim());
                    this.newMessage = "";
                }
            },
            deleteMessage(index) {
                this.messages = this.messages.filter((_, i) => i !== index);
            },
            setTargetWindow(window) {
                this.targetWindow = window;
                this.targetWindowDropdownOpen = false;
            },
            async toggleTargetWindowDropdown() {
                this.loadingOpenApps = true;
                this.targetWindowDropdownOpen = !this.targetWindowDropdownOpen;
                this.openApps = await window.electronAPI.getOpenApplications();
                this.loadingOpenApps = false;
            },
            toggleSettings() {
                this.settingsOpen = !this.settingsOpen;
                this.targetWindowDropdownOpen = false;
            },
            handleKeyDown(event) {
                if(event.key === 'Escape') {
                    if(this.newMessageModalOpen) {
                        this.newMessageModalOpen = false;
                    }
                }

                if(this.isSettingShortcut) {
                    this.addShortcutKey(event.key);
                }
            },
            openSaveMessagesModal() {
                this.saveMessagesModalOpen = true;
            },
            async saveMessages(saveAs = false) {
                if(this.title === null) {
                    await window.electronAPI.saveMessages(this.saveMessagesTitle, JSON.stringify(this.messages));
                    this.title = this.saveMessagesTitle;
                } else {
                    if(saveAs) {
                        await window.electronAPI.saveMessages(this.saveMessagesTitle, JSON.stringify(this.messages));
                        this.title = this.saveMessagesTitle;
                    } else {
                        await window.electronAPI.saveMessages(this.title, JSON.stringify(this.messages));
                    }
                }
                
                this.loadedMessages = JSON.parse(JSON.stringify(this.messages));
                this.messageLists = await window.electronAPI.getMessageLists();
                this.saveMessagesModalOpen = false;
                this.saveMessagesTitle = "";
            },
            updateMinDelay() {
                window.electronAPI.setMinDelay(this.minDelay);
                if(this.minDelay > this.maxDelay) {
                    this.maxDelay = this.minDelay;
                    window.electronAPI.setMaxDelay(this.maxDelay);
                }
            },
            updateMaxDelay() {
                window.electronAPI.setMaxDelay(this.maxDelay);
                if(this.maxDelay < this.minDelay) {
                    this.minDelay = this.maxDelay;
                    window.electronAPI.setMinDelay(this.minDelay);
                }
            },
            async openMessagesModal() {
                this.messageLists = await window.electronAPI.getMessageLists();
                this.openMessagesModalOpen = true;
            },
            openMessageList(list) {
                this.stop();
                this.messages = JSON.parse(list.messages);
                this.loadedMessages = JSON.parse(list.messages);
                this.title = list.title;
                this.openMessagesModalOpen = false;
            },
            newMessageList() {
                this.title = null;
                this.messages = [];
                this.loadedMessages = [];
            },
            deleteMessageList(listTitle) {
                window.electronAPI.deleteMessageList(listTitle);
                this.messageLists = this.messageLists.filter((l) => l.title !== listTitle);

                if(this.title === listTitle) {
                    this.title = null;
                    this.messages = [];
                }

                if(this.messageLists.length === 0) {
                    this.openMessagesModalOpen = false;
                }
            },

            // Autotyper methods
            start() {
                this.messageIndex = 0;
                this.tick = Date.now();
                this.nextTick = this.tick + (
                    Math.floor(
                        Math.random() * ((this.maxDelay * 1000) - (this.minDelay * 1000) + 1)
                    ) + (this.minDelay * 1000)
                );
                this.running = true;
                this.paused = false;
                this.tickInterval = setInterval(() => {
                    this.doTick();
                }, 1);
            },
            doTick() {
                if(this.targetWindow) {
                    if(this.activeWindow?.pid !== this.targetWindow?.pid) {
                        this.pause();
                        this.autoPaused = true;
                        return;
                    }
                }

                this.tick = Date.now();

                if(this.tick >= this.nextTick) {
                    this.typeMessage();
                    this.nextTick = this.tick + (
                        Math.floor(
                            Math.random() * ((this.maxDelay * 1000) - (this.minDelay * 1000) + 1)
                        ) + (this.minDelay * 1000)
                    );

                    console.log((this.nextTick - this.tick) / 1000 + 's');
                }

                if(this.messageIndex >= this.messages.length) {
                    this.stop();
                    this.start();
                }
            },
            pause() {
                if(this.paused && !this.autoPaused) return;
                if(this.autoPaused) {
                    this.pauseDuration += Date.now() - this.pausedAt;
                    this.autoPaused = false;
                    return;
                }

                this.paused = true;
                this.autoPaused = false;
                this.pausedAt = Date.now();
                window.electronAPI.autotypePause();
                window.electronAPI.autotypeTogglePause();
                clearInterval(this.tickInterval);
            },
            resume() {
                if(this.targetWindow) {
                    if(this.activeWindow?.pid !== this.targetWindow?.pid) {
                        this.pause();
                        this.autoPaused = true;
                        return;
                    }
                }

                this.paused = false;
                this.pauseDuration += Date.now() - this.pausedAt;
                const pausedDuration = Date.now() - this.pausedAt;
                console.log('Paused for ' + pausedDuration + 'ms');
                this.tick += pausedDuration;
                this.nextTick += pausedDuration;
                
                window.electronAPI.autotypeResume();
                this.tickInterval = setInterval(() => {
                    this.doTick();
                }, 1);
            },
            stop() {
                this.running = false;
                this.paused = false;
                this.autoPaused = false;
                this.pausedAt = null;
                clearInterval(this.tickInterval);
            },
            typeMessage() {
                const message = this.messages[this.messageIndex];
                console.log(message);
                window.electronAPI.autotype(message);
                this.messageIndex++;
            },

            // ElectronAPI methods
            minimizeWindow() {
                window.electronAPI.minimize();
            },
            closeWindow() {
                window.electronAPI.close();
            }
        },
        computed: {
            newMessageLength() {
                return this.newMessage.length;
            },
            hasChangesToList() {
                return JSON.stringify(this.messages) !== JSON.stringify(this.loadedMessages);
            }
        },
        watch: {
            activeWindow: {
                handler(newActiveWindow) {
                    if(!this.running) return;
                    if(newActiveWindow?.pid === this.knownActiveWindow?.pid) return;
                    if(!this.targetWindow) return;

                    if(this.targetWindow?.pid !== newActiveWindow?.pid && !this.paused && !this.autoPaused) {
                        this.pause();
                        this.autoPaused = true;
                    } else if(this.targetWindow?.pid === newActiveWindow?.pid && this.autoPaused) {
                        this.resume();
                        this.autoPaused = false;
                    }
                    
                    this.knownActiveWindow = newActiveWindow;
                }
            },
            messages: {
                handler(newMessages) {
                    if(newMessages.length === 0 && this.running) {
                        this.stop();
                    }
                }
            }
        }
	}
</script>