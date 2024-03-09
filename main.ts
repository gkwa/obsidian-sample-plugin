import {
	App,
	Editor,
	MarkdownView,
	getFrontMatterInfo,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

// Remember to rename these classes and interfaces!

interface HelloWorldPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: HelloWorldPluginSettings = {
	mySetting: "default",
};

export default class HelloWorldPlugin extends Plugin {
	settings: HelloWorldPluginSettings;

	async onload() {
		this.addRibbonIcon("dice", "Greet", () => {
			// Get the count of files in the vault
			const fileCount = this.app.vault.getFiles().length;
			console.log("Number of files in the vault:", fileCount);

			// Loop over all files in the vault
			this.app.vault.getFiles().forEach((file) => {
				console.log("File:", file.path);
				// Perform operations on each file
				// For example, you can read the file content using the following code:
				// this.app.vault.read(file).then((content) => {
				//   console.log('File content:', content);
				// });
			});
			new Notice("Hello, world!");
		});

		await this.loadSettings();

		console.log("hello world");
		console.log("hello world2");

		// Loop over all files in the vault
		this.app.vault.getFiles().forEach((file) => {
			console.log("File:", file.path);
			// Perform operations on each file
			// For example, you can read the file content using the following code:
			// this.app.vault.read(file).then((content) => {
			//   console.log('File content:', content);
			// });
		});

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				const fileCount = this.app.vault.getFiles().length;
				console.log("Number of files in the vault:", fileCount);

				console.log(
					"unresolvedLinks",
					this.app.metadataCache.unresolvedLinks
				);
				console.log(
					"resolvedLinks",
					this.app.metadataCache.resolvedLinks
				);

				// Get all files in the vault recursively
				const files = this.app.vault.getFiles();

				// Assuming you want to read the content of the first file in the array
				if (files.length > 0) {
					console.log("Files in the scratch vault:");
					for (const file of files) {
						// Read the content of the file as a string
						this.app.vault.read(file).then((content) => {
							// The content of the file is now available as a string in the 'content' variable
							console.log(content);

							const frontMatterInfo = getFrontMatterInfo(content);
							console.log(`File: ${file}`);
							console.log("Front Matter Information:");
							console.log(frontMatterInfo);
							console.log("---");

							// You can perform further operations with the content here
							// ...
						});
					}
				}

				// Loop over all files in the vault
				this.app.vault.getFiles().forEach((file) => {
					console.log("File11:", file.path);
					// Perform operations on each file
					// For example, you can read the file content using the following code:
					// this.app.vault.read(file).then((content) => {
					//   console.log('File content:', content);
					// });
				});

				// Called when the user clicks the icon.
				new Notice("This is a notice!");
				new Notice(`${fileCount} files in the vault`);
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-sample-modal-simple",
			name: "Open sample modal (simple)",
			callback: () => {
				new SampleModal(this.app).open();
			},
		});

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "sample-editor-command",
			name: "Sample editor command",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection("Sample Editor Command");
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: HelloWorldPlugin;

	constructor(app: App, plugin: HelloWorldPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
