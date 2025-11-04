# How to Add Text Center/Alignment Option to CKEditor

## Problem
The text center/alignment option is not showing because ClassicEditor pre-built bundle doesn't include the Alignment plugin.

## Solution: Create Custom CKEditor Build

### Step 1: Create Custom Build
1. Visit: **https://ckeditor.com/ckeditor-5/online-builder/**
2. Click **"Classic Editor"** button
3. In the plugin selection, search for **"Alignment"** and add it
4. Make sure these plugins are selected:
   - Alignment ✓
   - Bold, Italic, Underline, Strikethrough
   - Font Size, Font Family, Font Color, Font Background Color
   - Lists, Indent
   - Link, Block Quote, Table
   - Image Upload, Media Embed
   - Undo, Redo
   - Any other plugins you need
5. Click **"Build"** button
6. Download the ZIP file

### Step 2: Install Custom Build
1. Extract the downloaded ZIP file
2. Copy the entire folder to your project (e.g., `ckeditor5-custom-build/`)
3. In your `package.json`, you can either:
   - Use the build directly from the folder, OR
   - Install it as a local package

### Step 3: Update TextEditor Component
After installing the custom build, update `components/TextEditor/TextEditor.tsx`:

Change this line:
```typescript
import("@ckeditor/ckeditor5-build-classic")
```

To import from your custom build folder:
```typescript
import("./path/to/ckeditor5-custom-build/build/ckeditor")
```

### Alternative: Quick Workaround (CSS-based)
If you can't create a custom build right now, users can manually add alignment using CSS classes in the HTML source view, but this is not ideal.

---

**Note:** The alignment configuration is already set in the TextEditor component. Once you use a custom build with Alignment plugin, it will work immediately!
