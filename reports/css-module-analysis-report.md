# CSS Module Analysis Report

Generated: 8/21/2025, 6:30:12 PM

## Summary Statistics

- **TypeScript files processed**: 627
- **CSS module files found**: 149
- **Files with CSS imports**: 335
- **Total CSS class usages**: 2508
- **Errors found**: 16
- **Warnings**: 3

---

## ❌ Errors Found (16)

These issues need to be fixed:

---

### Undefined CSS Classes

1.  **File:** `src/features/user/TreeMapper/components/TreeMapperList.tsx:44`

    **Error:** Class 'pullUpBar' does not exist in TreeMapper.module.scss

    **CSS file:** `src/features/user/TreeMapper/TreeMapper.module.scss`

---

2.  **File:** `src/features/user/TreeMapper/components/InterventionPage.tsx:170`

    **Error:** Class 'singlePl' does not exist in TreeMapper.module.scss

    **CSS file:** `src/features/user/TreeMapper/TreeMapper.module.scss`

---

3.  **File:** `src/features/user/TreeMapper/components/InterventionPage.tsx:419`

    **Error:** Class 'pullUpBar' does not exist in TreeMapper.module.scss

    **CSS file:** `src/features/user/TreeMapper/TreeMapper.module.scss`

---

4.  **File:** `src/features/user/TreeMapper/Import/components/SampleTreeCard.tsx:65`

    **Error:** Class 'sampleTreeSummary' does not exist in Import.module.scss

    **CSS file:** `src/features/user/TreeMapper/Import/Import.module.scss`

---

5.  **File:** `src/features/user/TreeMapper/Import/components/ReviewSubmit.tsx:51`

    **Error:** Class 'stepDescription' does not exist in Import.module.scss

    **CSS file:** `src/features/user/TreeMapper/Import/Import.module.scss`

---

6.  **File:** `src/features/user/TreeMapper/Import/components/ReviewSubmit.tsx:112`

    **Error:** Class 'value' does not exist in Import.module.scss

    **CSS file:** `src/features/user/TreeMapper/Import/Import.module.scss`

---

7.  **File:** `src/features/user/TreeMapper/Import/components/ReviewSubmit.tsx:114`

    **Error:** Class 'link' does not exist in Import.module.scss

    **CSS file:** `src/features/user/TreeMapper/Import/Import.module.scss`

---

8.  **File:** `src/features/user/TreeMapper/Analytics/components/Map/components/InterventionDetails/index.tsx:192`

    **Error:** Class 'zeroStateScreen' does not exist in index.module.scss

    **CSS file:** `src/features/user/TreeMapper/Analytics/components/Map/components/InterventionDetails/index.module.scss`

---

9.  **File:** `src/features/user/TreeMapper/Analytics/components/Counter/components/CounterItem/index.tsx:39`

    **Error:** Class 'label' does not exist in index.module.scss

    **CSS file:** `src/features/user/TreeMapper/Analytics/components/Counter/components/CounterItem/index.module.scss`

---

10. **File:** `src/features/user/ManageProjects/ProjectsContainer.tsx:76`

    **Error:** Class 'projectUnitsAchieved' does not exist in ProjectsContainer.module.scss

    **CSS file:** `src/features/user/ManageProjects/ProjectsContainer.module.scss`

---

11. **File:** `src/features/user/ManageProjects/components/DetailedAnalysis.tsx:770`

    **Error:** Class 'multiSelectContainer' does not exist in StepForm.module.scss

    **CSS file:** `src/features/user/ManageProjects/StepForm.module.scss`

---

12. **File:** `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/SiteLayerOptions.tsx:77`

    **Error:** Class 'optionIcon' does not exist in SiteMapLayerControls.module.scss

    **CSS file:** `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/SiteMapLayerControls.module.scss`

---

13. **File:** `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/LayerInfoPopup.tsx:23`

    **Error:** Class 'popupContent' does not exist in SiteMapLayerControls.module.scss

    **CSS file:** `src/features/projectsV2/ProjectsMap/SiteMapLayerControls/SiteMapLayerControls.module.scss`

---

14. **File:** `src/features/projectsV2/ProjectsMap/ProjectSiteDropDown/ProjectSiteList.tsx:46`

    **Error:** Class 'withInterventions' does not exist in SiteDropdown.module.scss

    **CSS file:** `src/features/projectsV2/ProjectsMap/ProjectSiteDropDown/SiteDropdown.module.scss`

---

15. **File:** `src/features/projectsV2/ProjectsMap/FirePopup/index.tsx:130`

    **Error:** Class 'popperWrapper' does not exist in FirePopup.module.scss

    **CSS file:** `src/features/projectsV2/ProjectsMap/FirePopup/FirePopup.module.scss`

---

16. **File:** `src/features/projectsV2/ProjectListControls/microComponents/ProjectListTabForMobile.tsx:45`

    **Error:** Class 'starIconContainer' does not exist in ProjectListControls.module.scss

    **CSS file:** `src/features/projectsV2/ProjectListControls/styles/ProjectListControls.module.scss`

---

## ⚠️ Warnings (3)

These don't break functionality but may need attention:

---

### Dynamic CSS Classes

1.  **File:** `src/features/user/BulkCodes/components/UploadWidget.tsx:140`

    **Warning:** Dynamic class name 'uploadWidget\_\_statusText--${status}' cannot be statically verified

    **Status:** Manually checked, no issue

    **CSS file:** `src/features/user/BulkCodes/BulkCodes.module.scss`

---

2.  **File:** `src/features/user/BulkCodes/components/UploadWidget.tsx:156`

    **Warning:** Dynamic class name 'uploadWidget--${status}' cannot be statically verified

    **Status:** Manually checked, no issue

    **CSS file:** `src/features/user/BulkCodes/BulkCodes.module.scss`

---

3.  **File:** `src/features/common/WebappButton/index.tsx:34`

    **Warning:** Dynamic class name '${variant}WebappButton' cannot be statically verified

    **Status:** Manually checked, no issue

    **CSS file:** `src/features/common/WebappButton/WebappButton.module.scss`

---

## 🔧 How to Fix

### For Undefined Classes:

1. **Add missing CSS class** to the CSS file
2. **Fix typos** in class names
3. **Check import paths** are correct

### For Missing CSS Files:

1. **Create the missing CSS file**
2. **Update the import path**
3. **Move CSS files** to correct location

### For Dynamic Class Warnings:

1. **Verify with TypeScript plugin** - Use typescript-plugin-css-modules for type checking
2. **Ensure all possible class names exist** in the CSS file
3. **Consider using conditional logic** instead of template literals when possible
4. **Test runtime behavior** to ensure classes resolve correctly

### For Other Warnings:

1. **Remove unused CSS classes** if they're truly not needed
2. **Consider if classes are used elsewhere** in the project
3. **Keep utility classes** that might be used later

---

---

_Generated by CSS Module Static Analyzer_
