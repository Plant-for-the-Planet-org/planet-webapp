# 🧾 Dynamic Classname Logic Report

**Scanned Directory:** `./src`

- **Total Files Scanned:** 663
- **Files with Matches:** 124
- **Total Matches Found:** 382

---

### 📄 File: `src\features\common\CopyToClipboard\index.tsx`

**Match 1 (Line 44):**
```tsx
className={`${styles.copyButtonContainer} ${
          isButton ? styles.button : ''
        }`}
```

---

### 📄 File: `src\features\common\LandingVideo\PlayButton.tsx`

**Match 1 (Line 23):**
```tsx
const playButtonClasses = `${
    embed === 'true' ? styles.embed_playButton : styles.playButton
  } ${
    router.pathname === '/projects-archive/[p]' ||
    router.pathname === '/sites/[slug]/[locale]/projects-archive/[p]'
      ? styles['play
```

**Match 2 (Line 23):**
```tsx
const playButtonClasses = `${
    embed === 'true' ? styles.embed_playButton : styles.playButton
  } ${
    router.pathname === '/projects-archive/[p]' ||
    router.pathname === '/sites/[slug]/[locale]/projects-archive/[p]'
      ? styles['play
```

---

### 📄 File: `src\features\common\Layout\DashboardView\index.tsx`

**Match 1 (Line 84):**
```tsx
className={`dashboardContent--${variant}`}
```

**Match 2 (Line 92):**
```tsx
className={`dashboardContent--${variant}`}
```

---

### 📄 File: `src\features\common\Layout\ErrorPopup\index.tsx`

**Match 1 (Line 56):**
```tsx
className={`${styles.closeButton}`}
```

---

### 📄 File: `src\features\common\Layout\index.tsx`

**Match 1 (Line 23):**
```tsx
className={`${themeType}`}
```

---

### 📄 File: `src\features\common\Layout\LandingSection\index.tsx`

**Match 1 (Line 14):**
```tsx
className={`${styles.landingSection} ${
        props.fixedBg ? styles.landingSectionFixedBG : styles.landingSection
      }
      `}
```

---

### 📄 File: `src\features\common\Layout\Navbar\index.tsx`

**Match 1 (Line 21):**
```tsx
const headerStyles = `${styles.mainNavigationHeader} ${
    isImpersonationModeOn ? `${styles.impersonationMode}` : ''
  }`;
```

**Match 2 (Line 21):**
```tsx
const headerStyles = `${styles.mainNavigationHeader} ${
    isImpersonationModeOn ? `${styles.impersonationMode}`
```

---

### 📄 File: `src\features\common\Layout\Navbar\microComponents\NavbarItemGroup.tsx`

**Match 1 (Line 115):**
```tsx
className={`${styles.navbarMenu} ${styles[navbarItem.headerKey]}`}
```

---

### 📄 File: `src\features\common\Layout\Navbar\microComponents\NavbarMenuSection.tsx`

**Match 1 (Line 74):**
```tsx
className={`${styles.menuStyles} ${
          isOnlyIconSection ? styles.onlyIcon : ''
        }`}
```

---

### 📄 File: `src\features\common\Layout\ProjectsLayout\MobileProjectsLayout.tsx`

**Match 1 (Line 46):**
```tsx
const mobileLayoutClass = `${styles.mobileProjectsLayout} ${
    selectedMode === 'map' ? styles.mapMode : ''
  } ${isEmbedded ? styles.embedModeMobile : ''} ${
    isImpersonationModeOn ? styles.impersonationMobile : ''
  }`;
```

**Match 2 (Line 46):**
```tsx
const mobileLayoutClass = `${styles.mobileProjectsLayout} ${
    selectedMode === 'map' ? styles.mapMode : ''
  } ${isEmbedded ? styles.embedModeMobile : ''} ${
    isImpersonationModeOn ? styles.impersonationMobile : ''
  }`
```

---

### 📄 File: `src\features\common\Layout\UserLayout\NavLink.tsx`

**Match 1 (Line 132):**
```tsx
className={`${styles.navLink} ${
          isCurrentMainMenu ? styles.navLinkActive : ''
        } ${isSubMenuOpen ? styles.navLinkOpen : ''}`}
```

**Match 2 (Line 161):**
```tsx
className={`${styles.navLinkSubMenu} ${
                  currentSubMenuKey === subLink.key
                    ? styles.navLinkActiveSubMenu
                    : ''
                }`}
```

---

### 📄 File: `src\features\common\Layout\UserLayout\UserLayout.tsx`

**Match 1 (Line 308):**
```tsx
className={`${styles.hamburgerIcon}`}
```

**Match 2 (Line 323):**
```tsx
className={`${styles.closeMenu}`}
```

**Match 3 (Line 325):**
```tsx
className={`${styles.navLink}`}
```

---

### 📄 File: `src\features\common\TreeCounter\TreeCounter.tsx`

**Match 1 (Line 144):**
```tsx
className={
          isHomeTreeCounter
            ? treeCounterStyles.backgroundCircle
            : treeCounterStyles.backgroundCircleForTenant
        }
```

---

### 📄 File: `src\features\common\WebappButton\index.tsx`

**Match 1 (Line 75):**
```tsx
className={`${styles.webappButton} ${buttonVariantClasses} ${
              otherProps.buttonClasses ? otherProps.buttonClasses : ''
            }`}
```

**Match 2 (Line 99):**
```tsx
className={`${styles.webappButton} ${buttonVariantClasses} ${
            otherProps.buttonClasses ? otherProps.buttonClasses : ''
          }`}
```

**Match 3 (Line 114):**
```tsx
className={`${styles.webappButton} ${buttonVariantClasses} ${
        otherProps.buttonClasses ? otherProps.buttonClasses : ''
      }`}
```

---

### 📄 File: `src\features\projects\components\Intervention\InterventionDetails.tsx`

**Match 1 (Line 188):**
```tsx
className={`${styles.projectImageSliderContainer} ${styles.singlePl}`}
```

---

### 📄 File: `src\features\projects\components\maps\Explore.tsx`

**Match 1 (Line 217):**
```tsx
className={
            embed === 'true' ? styles.embed_exploreButton : styles.exploreButton
          }
```

**Match 2 (Line 245):**
```tsx
className={
                embed === 'true'
                  ? styles.embed_exploreExpanded
                  : styles.exploreExpanded
              }
```

---

### 📄 File: `src\features\projects\components\maps\ImageDropdown.tsx`

**Match 1 (Line 65):**
```tsx
const containerClasses =
    embed !== 'true'
      ? styles.dropdownContainer
      : showProjectDetails === 'false'
      ? `${styles.embed_dropdownContainer} ${styles['no-project-details']}`
      : styles.embed_dropdownContainer;
```

---

### 📄 File: `src\features\projects\components\maps\Interventions.tsx`

**Match 1 (Line 219):**
```tsx
className={`${styles.single} ${
                        spl.hid === sampleIntervention?.hid
                          ? styles.singleSelected
                          : ''
                      }`}
```

---

### 📄 File: `src\features\projects\components\maps\Location.tsx`

**Match 1 (Line 29):**
```tsx
className={`${styles.marker} ${
              project.purpose === 'conservation'
                ? styles.conservationMarker
                : ''
            }`}
```

---

### 📄 File: `src\features\projects\components\maps\Markers.tsx`

**Match 1 (Line 80):**
```tsx
className={`${styles.marker} ${
                styles[markerBackgroundColor(projectMarker.properties)]
              }`}
```

---

### 📄 File: `src\features\projects\components\maps\ProjectTabs.tsx`

**Match 1 (Line 45):**
```tsx
className={`${styles.options} ${styles.compact}`}
```

**Match 2 (Line 63):**
```tsx
className={`${styles.options} ${styles.compact}`}
```

**Match 3 (Line 21):**
```tsx
const containerClasses =
    embed !== 'true'
      ? styles.VegetationChangeContainer
      : router.pathname.includes('/projects-archive/[p]') &&
        showProjectDetails === 'false'
      ? `${styles.embed_VegetationChangeContainer} ${style
```

---

### 📄 File: `src\features\projects\components\maps\SitesDropdown.tsx`

**Match 1 (Line 50):**
```tsx
const dropdownContainerClasses = `${
    embed === 'true' ? styles.embed_dropdownContainer : styles.dropdownContainer
  } ${
    router.pathname.includes('/projects-archive/[p]')
      ? styles['dropdownContainer--reduce-right-offset']
      : '
```

**Match 2 (Line 58):**
```tsx
const projectSitesButtonClasses = `${
    embed === 'true'
      ? styles.embed_projectSitesButton
      : styles.projectSitesButton
  } ${
    router.pathname.includes('/projects-archive/[p]')
      ? styles['projectSitesButton--reduce-right-o
```

**Match 3 (Line 50):**
```tsx
const dropdownContainerClasses = `${
    embed === 'true' ? styles.embed_dropdownContainer : styles.dropdownContainer
  } ${
    router.pathname.includes('/projects-archive/[p]')
      ? styles['dropdownContainer--reduce-right-offset']
      : '
```

**Match 4 (Line 58):**
```tsx
const projectSitesButtonClasses = `${
    embed === 'true'
      ? styles.embed_projectSitesButton
      : styles.projectSitesButton
  } ${
    router.pathname.includes('/projects-archive/[p]')
      ? styles['projectSitesButton--reduce-right-o
```

---

### 📄 File: `src\features\projects\components\PopupProject.tsx`

**Match 1 (Line 134):**
```tsx
className={`${styles.progressBarHighlight} ${progressBarBackgroundColor}`}
```

**Match 2 (Line 212):**
```tsx
className={`${styles.donateButton} ${donateButtonBackgroundColor}`}
```

**Match 3 (Line 70):**
```tsx
const progressBarBackgroundColor =
    project.isTopProject && project.isApproved
      ? `${styles.topApproved}`
      : project.allowDonations
      ? `${styles.topUnapproved}`
      : `${styles.notDonatable}`;
```

---

### 📄 File: `src\features\projects\components\projects\Filters.tsx`

**Match 1 (Line 115):**
```tsx
className={`${styles.filterButton} ${
            filtersOpen ? styles.selected : ''
          }`}
```

**Match 2 (Line 121):**
```tsx
className={`${styles.dropdownIcon} ${
              filtersOpen ? styles.selected : ''
            }`}
```

---

### 📄 File: `src\features\projects\components\projects\Header.tsx`

**Match 1 (Line 30):**
```tsx
className={
                selectedTab === 'top' ? 'tabButtonSelected' : 'tabButtonText'
              }
```

**Match 2 (Line 43):**
```tsx
className={
                selectedTab === 'all' ? 'tabButtonSelected' : 'tabButtonText'
              }
```

---

### 📄 File: `src\features\projects\components\ProjectsMap.tsx`

**Match 1 (Line 161):**
```tsx
className={
        embed === 'true' ? styles.onlyMapContainer : styles.mapContainer
      }
```

---

### 📄 File: `src\features\projects\components\ProjectSnippet.tsx`

**Match 1 (Line 140):**
```tsx
className={`${styles.projectImage} ${
          selectedPl || hoveredPl ? styles.projectCollapsed : ''
        }`}
```

**Match 2 (Line 192):**
```tsx
className={`${styles.progressBarHighlight} ${progressBarBackgroundColor}`}
```

**Match 3 (Line 264):**
```tsx
className={`${styles.donateButton} ${donateButtonBackgroundColor}`}
```

**Match 4 (Line 106):**
```tsx
const progressBarBackgroundColor =
    project.isTopProject && project.isApproved
      ? `${styles.topApproved}`
      : project.allowDonations
      ? `${styles.topUnapproved}`
      : `${styles.notDonatable}`;
```

---

### 📄 File: `src\features\projects\screens\Projects.tsx`

**Match 1 (Line 231):**
```tsx
className={isEmbed ? 'embedContainer' : 'container'}
```

**Match 2 (Line 244):**
```tsx
className={`sidebar ${
                isMobile && hideSidebar && showProjectList !== 'true'
                  ? 'mobile-hidden'
                  : ''
              }
```

**Match 3 (Line 250):**
```tsx
className={`header ${isMobile ? 'header--mobile' : ''}
```

**Match 4 (Line 244):**
```tsx
className={`sidebar ${
                isMobile && hideSidebar && showProjectList !== 'true'
                  ? 'mobile-hidden'
                  : ''
              } ${isImpersonationModeOn ? `impersonationTop` : ''}`}
```

**Match 5 (Line 250):**
```tsx
className={`header ${isMobile ? 'header--mobile' : ''}`}
```

---

### 📄 File: `src\features\projects\screens\SingleProjectDetails.tsx`

**Match 1 (Line 146):**
```tsx
className={isEmbed ? 'embedContainer' : 'container'}
```

**Match 2 (Line 184):**
```tsx
className={`projectContainer ${
              isMobile && hideProjectContainer && showProjectDetails !== 'true'
                ? 'mobile-hidden'
                : ''
            }
```

**Match 3 (Line 184):**
```tsx
className={`projectContainer ${
              isMobile && hideProjectContainer && showProjectDetails !== 'true'
                ? 'mobile-hidden'
                : ''
            }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectDetails\components\microComponents\SingleProjectInfoItem.tsx`

**Match 1 (Line 10):**
```tsx
const SingleProjectInfoItem = ({ title, children }: Props) => {
  return (
    <div className={styles.singleRowInfoContent}>
      {typeof title === 'string' ? (
        <h2 className={styles.singleRowInfoTitle}>{title}</h2>
      ) : (
       
```

---

### 📄 File: `src\features\projectsV2\ProjectListControls\microComponents\ActiveSearchField.tsx`

**Match 1 (Line 46):**
```tsx
className={`${styles.activeSearchFieldContainer} ${
        onlyMapModeAllowed ? styles.onlyMapMode : ''
      }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectListControls\microComponents\ClassificationDropDown.tsx`

**Match 1 (Line 73):**
```tsx
className={`${
            selectedClassification?.includes(filterItem)
              ? styles.selected
              : styles.unselected
          }
```

**Match 2 (Line 100):**
```tsx
className={isFilterApplied ? styles.unselected : styles.selected}
```

**Match 3 (Line 115):**
```tsx
className={
              showDonatableProjects ? styles.selected : styles.unselected
            }
```

**Match 4 (Line 73):**
```tsx
className={`${
            selectedClassification?.includes(filterItem)
              ? styles.selected
              : styles.unselected
          } 
          ${styles.classificationItem}`}
```

**Match 5 (Line 61):**
```tsx
const filterListContainerClass = `${styles.classificationListContainer} ${
    selectedMode === 'list' ? styles.listMode : ''
  }`;
```

**Match 6 (Line 65):**
```tsx
const classificationFilters = useMemo(() => {
    return availableFilters.map((filterItem, index) => (
      <button
        key={filterItem}
        className={styles.filterButton}
        onClick={() => handleFilterSelection(filterItem)}
    
```

**Match 7 (Line 61):**
```tsx
const filterListContainerClass = `${styles.classificationListContainer} ${
    selectedMode === 'list' ? styles.listMode : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectListControls\microComponents\ProjectSearchAndFilter.tsx`

**Match 1 (Line 17):**
```tsx
const SearchAndFilter = ({
  hasFilterApplied,
  setIsFilterOpen,
  isFilterOpen,
  setIsSearching,
  isSearching,
  isMobile,
  selectedMode,
}: ProjectSearchAndFilterProps) => {
  const searchAndFilterContainerClasses = `${
    isMobile ?
```

**Match 2 (Line 26):**
```tsx
const searchAndFilterContainerClasses = `${
    isMobile ? styles.iconsContainerMobile : styles.iconsContainer
  } ${selectedMode === 'map' && isMobile ? styles.mapModeButtons : ''}`
```

---

### 📄 File: `src\features\projectsV2\ProjectListControls\microComponents\ViewModeTabs.tsx`

**Match 1 (Line 56):**
```tsx
const tabContainerClass = `${
    isSearching ? styles.tabContainerSecondary : styles.tabContainer
  } ${selectedMode === 'map' ? styles.mapModeTabs : ''}`;
```

**Match 2 (Line 56):**
```tsx
const tabContainerClass = `${
    isSearching ? styles.tabContainerSecondary : styles.tabContainer
  } ${selectedMode === 'map' ? styles.mapModeTabs : ''}`
```

---

### 📄 File: `src\features\projectsV2\ProjectListControls\ProjectListControlForMobile.tsx`

**Match 1 (Line 77):**
```tsx
const projectListControlsMobileClasses = `${
    styles.projectListControlsMobile
  } ${selectedMode === 'map' ? styles.mapModeControls : ''} ${
    isImpersonationModeOn ? styles['impersonationMode'] : ''
  }`;
```

**Match 2 (Line 82):**
```tsx
const tabContainerClasses = `${styles.tabsContainer} ${
    isImpersonationModeOn ? styles['impersonationMode'] : ''
  }`;
```

**Match 3 (Line 77):**
```tsx
const projectListControlsMobileClasses = `${
    styles.projectListControlsMobile
  } ${selectedMode === 'map' ? styles.mapModeControls : ''} ${
    isImpersonationModeOn ? styles['impersonationMode'] : ''
  }`
```

**Match 4 (Line 82):**
```tsx
const tabContainerClasses = `${styles.tabsContainer} ${
    isImpersonationModeOn ? styles['impersonationMode'] : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\FirePopup\index.tsx`

**Match 1 (Line 143):**
```tsx
className={`${styles.arrowTop}`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\index.tsx`

**Match 1 (Line 308):**
```tsx
const mapContainerClass = `${styles.mapContainer} ${
    styles[mobileOS !== undefined ? mobileOS : '']
  }`;
```

**Match 2 (Line 308):**
```tsx
const mapContainerClass = `${styles.mapContainer} ${
    styles[mobileOS !== undefined ? mobileOS : '']
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\InterventionDropDown\InterventionList.tsx`

**Match 1 (Line 50):**
```tsx
className={`${styles.interventionListOptions} ${
        !hasProjectSites
          ? styles.interventionListOptionsAbove
          : styles.interventionListOptionsBelow
      }`}
```

**Match 2 (Line 63):**
```tsx
className={`${styles.listItem} ${
              intervention.value === selectedInterventionData?.value
                ? styles.selectedItem
                : ''
            }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\MapControls.tsx`

**Match 1 (Line 143):**
```tsx
const layerToggleClass = `${styles.layerToggle} ${
    isMobile
      ? mobileOS === 'android'
        ? styles.layerToggleAndroid
        : styles.layerToggleIos
      : styles.layerToggleDesktop
  }`;
```

**Match 2 (Line 150):**
```tsx
const projectListControlsContainerStyles = `${
    styles.projectListControlsContainer
  } ${embed === 'true' ? styles.embedModeMobile : ''}`;
```

**Match 3 (Line 153):**
```tsx
const siteInterventionDropdownsMobileStyles = `${
    styles.siteInterventionDropdownsMobile
  } ${embed === 'true' ? styles.embedModeMobile : ''}`;
```

**Match 4 (Line 143):**
```tsx
const layerToggleClass = `${styles.layerToggle} ${
    isMobile
      ? mobileOS === 'android'
        ? styles.layerToggleAndroid
        : styles.layerToggleIos
      : styles.layerToggleDesktop
  }`
```

**Match 5 (Line 150):**
```tsx
const projectListControlsContainerStyles = `${
    styles.projectListControlsContainer
  } ${embed === 'true' ? styles.embedModeMobile : ''}`
```

**Match 6 (Line 153):**
```tsx
const siteInterventionDropdownsMobileStyles = `${
    styles.siteInterventionDropdownsMobile
  } ${embed === 'true' ? styles.embedModeMobile : ''}`
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\MapFeatureExplorer\index.tsx`

**Match 1 (Line 29):**
```tsx
className={`${styles.exploreButton} ${isOpen ? 'active' : ''}`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\MapFeatureExplorer\microComponents\LayerLegend.tsx`

**Match 1 (Line 49):**
```tsx
className={`${styles.legendBar} ${styles.legendBarCategory}`}
```

**Match 2 (Line 22):**
```tsx
const RangeLegend = ({ legend }: RangeLegendProps) => {
  return (
    <div className={styles.layerLegend}>
      <div
        className={styles.legendBar}
        style={{ background: legend.gradient }}
      ></div>
      <div className={sty
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\MapFeatureExplorer\microComponents\SingleLayerOption.tsx`

**Match 1 (Line 67):**
```tsx
className={`${styles.layerLabel} ${
            hasInfoPopover ? styles.additionalInfo : ''
          }`}
```

**Match 2 (Line 59):**
```tsx
const singleLayerOptionStyles = `${styles.singleLayerOption} ${
    isLegendVisible ? styles.legendVisible : ''
  }`;
```

**Match 3 (Line 59):**
```tsx
const singleLayerOptionStyles = `${styles.singleLayerOption} ${
    isLegendVisible ? styles.legendVisible : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\MapFeatureExplorer\MobileMapSettingsLayout.tsx`

**Match 1 (Line 62):**
```tsx
className={`${styles.scrollableContent} ${
          isAtBottom ? styles.atBottom : ''
        }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\microComponents\InterventionLayers.tsx`

**Match 1 (Line 49):**
```tsx
className={`${styles.single} ${
        sampleTree.hid === selectedSampleTree?.hid ? styles.singleSelected : ''
      }`}
```

**Match 2 (Line 36):**
```tsx
const SampleTreeMarker = ({
  sampleTree,
  selectedSampleTree,
  toggleSampleTree,
}: SampleTreeMarkerProps) => (
  <Marker
    key={`${sampleTree.id}-sample`}
    latitude={sampleTree.geometry.coordinates[1]}
    longitude={sampleTree.geome
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\ProjectMapTabs\index.tsx`

**Match 1 (Line 63):**
```tsx
className={
          setSeparatorVisibility(selectedTab, 0)
            ? styles.showSeparator1
            : styles.hideSeparator
        }
```

**Match 2 (Line 81):**
```tsx
className={
          setSeparatorVisibility(selectedTab, 1)
            ? styles.showSeparator2
            : styles.hideSeparator
        }
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\ProjectMapTabs\SingleTab.tsx`

**Match 1 (Line 20):**
```tsx
className={`${styles.singleTabOption} ${
        isSelected ? styles.selected : ''
      }`}
```

**Match 2 (Line 12):**
```tsx
const SingleTab = ({
  icon,
  title,
  isSelected,
  onClickHandler,
}: SingleTabProps) => {
  return (
    <button
      className={`${styles.singleTabOption} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={onClickH
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\ProjectSiteDropDown\index.tsx`

**Match 1 (Line 92):**
```tsx
className={`${
          hasMultipleSites ? styles.dropdownButton : styles.dropdownDetails
        }
```

**Match 2 (Line 92):**
```tsx
className={`${
          hasMultipleSites ? styles.dropdownButton : styles.dropdownDetails
        }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\ProjectSiteDropDown\ProjectSiteList.tsx`

**Match 1 (Line 43):**
```tsx
className={`${styles.listItem} ${
              site.id === selectedSiteData?.id ? styles.selectedItem : ''
            }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\SiteMapLayerControls\AverageIndicator.tsx`

**Match 1 (Line 37):**
```tsx
const averageIndicatorStyles = `${styles.averageIndicator} ${
    average > 0 ? styles.positive : styles.negative
  } ${isNearLeftEdge ? styles.leftAligned : ''} ${
    isNearRightEdge ? styles.rightAligned : ''
  }`;
```

**Match 2 (Line 37):**
```tsx
const averageIndicatorStyles = `${styles.averageIndicator} ${
    average > 0 ? styles.positive : styles.negative
  } ${isNearLeftEdge ? styles.leftAligned : ''} ${
    isNearRightEdge ? styles.rightAligned : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\SiteMapLayerControls\SiteLayerDropdown.tsx`

**Match 1 (Line 57):**
```tsx
className={`${styles.dropdownButtonArrow} ${
            isOpen ? styles.arrowRotated : ''
          }`}
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\SiteMapLayerControls\SiteLayerOptions.tsx`

**Match 1 (Line 74):**
```tsx
className={`${styles.singleLayerOption} ${
        isSelected ? styles.selected : ''
      }`}
```

**Match 2 (Line 67):**
```tsx
const SingleLayerOption = ({
  option,
  isSelected,
  handleLayerSelection,
}: SingleOptionProps) => {
  return (
    <div
      className={`${styles.singleLayerOption} ${
        isSelected ? styles.selected : ''
      }`}
      onClick={
```

---

### 📄 File: `src\features\projectsV2\ProjectsMap\TimeTravel\index.tsx`

**Match 1 (Line 477):**
```tsx
className={`${isVisible ? styles.visible : styles.hidden}
```

**Match 2 (Line 477):**
```tsx
className={`${isVisible ? styles.visible : styles.hidden}`}
```

---

### 📄 File: `src\features\projectsV2\ProjectSnippet\index.tsx`

**Match 1 (Line 139):**
```tsx
className={`${styles.progressBarHighlight} ${progressBarClass}`}
```

**Match 2 (Line 163):**
```tsx
const projectSnippetContainerClasses = `${styles.singleProject} ${
    page === 'project-details' && isMobile
      ? styles.projectDetailsSnippetMobile
      : ''
  }`;
```

**Match 3 (Line 163):**
```tsx
const projectSnippetContainerClasses = `${styles.singleProject} ${
    page === 'project-details' && isMobile
      ? styles.projectDetailsSnippetMobile
      : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectSnippet\microComponents\ImageSection.tsx`

**Match 1 (Line 147):**
```tsx
className={`${styles.projectImageFile} ${
            isImageLoading ? styles.hidden : ''
          }`}
```

**Match 2 (Line 86):**
```tsx
const imageContainerClasses = `${styles.projectImage} ${
    page === 'project-details' ? styles.projectImageSecondary : ''
  }`;
```

**Match 3 (Line 86):**
```tsx
const imageContainerClasses = `${styles.projectImage} ${
    page === 'project-details' ? styles.projectImageSecondary : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\ProjectSnippet\microComponents\ProjectBadge.tsx`

**Match 1 (Line 38):**
```tsx
className={`${styles.projectBadge} ${
        !isInteractive ? styles.nonInteractive : ''
      }`}
```

**Match 2 (Line 35):**
```tsx
const BadgeLabel = ({ icon, title, isInteractive }: BadgeLabelProps) => {
  return (
    <div
      className={`${styles.projectBadge} ${
        !isInteractive ? styles.nonInteractive : ''
      }`}
      onClick={(e) => e.preventDefault()}
 
```

**Match 3 (Line 96):**
```tsx
const renderMessage = (badgeType: string | undefined) => {
    if (badgeType === 'notDonatable') {
      return (
        <div className={styles.tooltipContent}>
          {tenantConfig.config.slug === 'salesforce'
            ? `${tCommon('sale
```

---

### 📄 File: `src\features\projectsV2\ProjectSnippet\microComponents\TpoName.tsx`

**Match 1 (Line 46):**
```tsx
const tpoNameContainerClasses = `${
    styles.projectTpoName
  } ${tpoNameBackgroundClass} ${
    page === 'project-details' ? styles.projectTpoNameSecondary : ''
  }`;
```

**Match 2 (Line 46):**
```tsx
const tpoNameContainerClasses = `${
    styles.projectTpoName
  } ${tpoNameBackgroundClass} ${
    page === 'project-details' ? styles.projectTpoNameSecondary : ''
  }`
```

---

### 📄 File: `src\features\projectsV2\TimeTravelDropdown\index.tsx`

**Match 1 (Line 113):**
```tsx
className={`${
                  isOptionSelected(year, selectedYear)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }
```

**Match 2 (Line 128):**
```tsx
className={`${
                  isOptionSelected(source, selectedSource)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }
```

**Match 3 (Line 74):**
```tsx
className={`${styles.menuContainer} ${customClassName || ''}`}
```

**Match 4 (Line 113):**
```tsx
className={`${
                  isOptionSelected(year, selectedYear)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }`}
```

**Match 5 (Line 128):**
```tsx
className={`${
                  isOptionSelected(source, selectedSource)
                    ? styles.selectedMenuItem
                    : styles.unselectedMenuItem
                }`}
```

---

### 📄 File: `src\features\user\Account\components\AccountRecord.tsx`

**Match 1 (Line 65):**
```tsx
className={`${styles.top} ${styles.recordTitle}`}
```

**Match 2 (Line 88):**
```tsx
className={`${styles.top} ${styles[netAmountStatus]}`}
```

**Match 3 (Line 92):**
```tsx
className={`${styles.recordStatus} ${styles[record.status]}`}
```

**Match 4 (Line 287):**
```tsx
className={`${styles.singleDetail} ${styles.fullWidth}`}
```

**Match 5 (Line 293):**
```tsx
className={`${styles.singleDetail} ${styles.fullWidth}`}
```

**Match 6 (Line 432):**
```tsx
const outerDivClasses = isModal
    ? styles.recordModal
    : `${styles.record} ${selectedRecord === index ? styles.selected : ''}`;
```

---

### 📄 File: `src\features\user\Account\components\DownloadCodes.tsx`

**Match 1 (Line 84):**
```tsx
className={`${styles.spinner} ${styles['spinner--primary']}`}
```

---

### 📄 File: `src\features\user\Account\components\MembershipCta.tsx`

**Match 1 (Line 16):**
```tsx
className={`${styles.membershipCta} ${
        placement === 'top'
          ? styles.membershipCtaTop
          : styles.membershipCtaRight
      }`}
```

---

### 📄 File: `src\features\user\Account\components\RecurrencyRecord.tsx`

**Match 1 (Line 64):**
```tsx
className={`${styles.recurrencyRecordHeader}`}
```

**Match 2 (Line 114):**
```tsx
className={`${styles.top} ${styles.amount}`}
```

**Match 3 (Line 117):**
```tsx
className={`${styles.status} ${statusStyle}`}
```

**Match 4 (Line 219):**
```tsx
className={`${styles.singleDetail} ${styles.fullWidth}`}
```

**Match 5 (Line 351):**
```tsx
const outerDivClasses = isModal
    ? styles.recordModal
    : `${styles.record} ${selectedRecord === index ? styles.selected : ''}`;
```

---

### 📄 File: `src\features\user\Account\EditModal.tsx`

**Match 1 (Line 135):**
```tsx
className={`${styles.manageDonationModal} ${styles.editDonationModal}`}
```

---

### 📄 File: `src\features\user\Account\History.tsx`

**Match 1 (Line 74):**
```tsx
className={`${styles.filterButton} ${
                    filter === item[0] ? styles.selected : ''
                  }`}
```

**Match 2 (Line 143):**
```tsx
className={`${styles.filterButton} ${
                          filter === item[0] ? styles.selected : ''
                        }`}
```

---

### 📄 File: `src\features\user\Account\Recurrency.tsx`

**Match 1 (Line 68):**
```tsx
className={`${styles.section} ${styles.recurrencySection}`}
```

---

### 📄 File: `src\features\user\CompleteSignup\index.tsx`

**Match 1 (Line 265):**
```tsx
className={requestSent ? styles.signupRequestSent : styles.signup}
```

---

### 📄 File: `src\features\user\ManageProjects\components\BasicDetails.tsx`

**Match 1 (Line 726):**
```tsx
className={`${styles.formFieldLarge} ${styles.mapboxContainer}`}
```

**Match 2 (Line 763):**
```tsx
className={`${styles.formFieldHalf} ${styles.latLongField}`}
```

**Match 3 (Line 798):**
```tsx
className={`${styles.formFieldHalf} ${styles.latLongField}`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\DetailedAnalysis.tsx`

**Match 1 (Line 783):**
```tsx
className={`${styles.multiSelectInputCheck} ${
                        isSet ? styles.multiSelectInputCheckTrue : ''
                      }`}
```

**Match 2 (Line 831):**
```tsx
className={`${styles.multiSelectInputCheck} ${
                      month.isSet ? styles.multiSelectInputCheckTrue : ''
                    }`}
```

**Match 3 (Line 1175):**
```tsx
className={`${styles.multiSelectInputCheck} ${
                      owner.isSet ? styles.multiSelectInputCheckTrue : ''
                    }`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\microComponent\DrawingControls.tsx`

**Match 1 (Line 41):**
```tsx
className={isDrawing ? styles.activePolygonButton : ''}
```

---

### 📄 File: `src\features\user\ManageProjects\components\microComponent\EditSite.tsx`

**Match 1 (Line 105):**
```tsx
className={`${isUploadingData ? styles.shallowOpacity : ''}
```

**Match 2 (Line 105):**
```tsx
className={`${isUploadingData ? styles.shallowOpacity : ''}`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\microComponent\LayerToggle.tsx`

**Match 1 (Line 21):**
```tsx
className={`${styles.layerOption} ${
          isSatelliteMode ? '' : styles.active
        }`}
```

**Match 2 (Line 31):**
```tsx
className={`${styles.layerOption} ${
          isSatelliteMode ? styles.active : ''
        }`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\ProjectCertificates.tsx`

**Match 1 (Line 198):**
```tsx
className={` ${styles.reportPDFContainer}`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\ProjectMedia.tsx`

**Match 1 (Line 260):**
```tsx
className={`inputContainer ${
            isUploadingData ? styles.shallowOpacity : ''
          }
```

**Match 2 (Line 325):**
```tsx
className={image.isDefault ? 'selected' : ''}
```

**Match 3 (Line 260):**
```tsx
className={`inputContainer ${
            isUploadingData ? styles.shallowOpacity : ''
          }`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\ProjectSites.tsx`

**Match 1 (Line 332):**
```tsx
className={`${isUploadingData ? styles.shallowOpacity : ''}
```

**Match 2 (Line 332):**
```tsx
className={`${isUploadingData ? styles.shallowOpacity : ''}`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\ProjectSpending.tsx`

**Match 1 (Line 179):**
```tsx
className={` ${styles.reportPDFContainer}`}
```

**Match 2 (Line 206):**
```tsx
className={`${styles.expenseContainer} ${
              isUploadingData ? styles.shallowOpacity : ''
            }`}
```

---

### 📄 File: `src\features\user\ManageProjects\components\SiteGeometryEditor.tsx`

**Match 1 (Line 149):**
```tsx
className={`${styles.formFieldLarge} ${styles.siteGeometryEditor}`}
```

---

### 📄 File: `src\features\user\PlanetCash\components\AccountDetails.tsx`

**Match 1 (Line 79):**
```tsx
className={`accountDetails ${
        !account.isActive ? 'accountDetails--inactive' : ''
      }
```

**Match 2 (Line 79):**
```tsx
className={`accountDetails ${
        !account.isActive ? 'accountDetails--inactive' : ''
      }`}
```

---

### 📄 File: `src\features\user\Profile\CommunityContributions\index.tsx`

**Match 1 (Line 28):**
```tsx
className={`${tabSelected === 'most-recent' ? styles.selected : ''}
```

**Match 2 (Line 34):**
```tsx
className={`${tabSelected === 'most-trees' ? styles.selected : ''}
```

**Match 3 (Line 28):**
```tsx
className={`${tabSelected === 'most-recent' ? styles.selected : ''}`}
```

**Match 4 (Line 34):**
```tsx
className={`${tabSelected === 'most-trees' ? styles.selected : ''}`}
```

---

### 📄 File: `src\features\user\Profile\ForestProgress\ForestProgressItem.tsx`

**Match 1 (Line 37):**
```tsx
className={`${styles.progressMainContainer} ${styles[dataType]}`}
```

---

### 📄 File: `src\features\user\Profile\ForestProgress\TargetFormInput.tsx`

**Match 1 (Line 57):**
```tsx
className={`${targetContainerClass} ${
        isLocalTargetSet && isChecked && styles[dataType]
      }`}
```

---

### 📄 File: `src\features\user\Profile\MyContributions\DonateButton.tsx`

**Match 1 (Line 38):**
```tsx
const buttonClasses = `${styles.donationButton} ${
    projectPurpose === 'conservation'
      ? styles.conservation
      : contributionUnitType === 'm2'
      ? styles.restoration
      : ''
  } ${customButtonClasses || ''}`;
```

**Match 2 (Line 38):**
```tsx
const buttonClasses = `${styles.donationButton} ${
    projectPurpose === 'conservation'
      ? styles.conservation
      : contributionUnitType === 'm2'
      ? styles.restoration
      : ''
  } ${customButtonClasses || ''}`
```

---

### 📄 File: `src\features\user\Profile\MyContributions\ItemImage.tsx`

**Match 1 (Line 17):**
```tsx
className={`${styles.itemImageContainer} ${
        !giftDetails ? styles.roundedCorners : ''
      }`}
```

**Match 2 (Line 14):**
```tsx
const ItemImage = ({ imageUrl, giftDetails }: Props) => {
  return (
    <div
      className={`${styles.itemImageContainer} ${
        !giftDetails ? styles.roundedCorners : ''
      }`}
      style={
        imageUrl
          ? {
        
```

---

### 📄 File: `src\features\user\Profile\MyContributions\ProjectHeader.tsx`

**Match 1 (Line 61):**
```tsx
className={`${styles.projectHeader} ${styles[color]}`}
```

---

### 📄 File: `src\features\user\Profile\MyContributions\ProjectItemCard.tsx`

**Match 1 (Line 65):**
```tsx
className={`${styles.projectItemCard} ${styles[projectType]}`}
```

**Match 2 (Line 161):**
```tsx
className={`${styles.sectionTwo} ${styles[projectType]}`}
```

---

### 📄 File: `src\features\user\Profile\ProfileLayout\index.tsx`

**Match 1 (Line 62):**
```tsx
className={`${styles.mapContainer} ${
          !isContributionsDataLoaded ? styles.loading : ''
        }`}
```

**Match 2 (Line 74):**
```tsx
className={`${styles.progressContainer} ${
          !isProgressDataLoaded ? styles.loading : ''
        }`}
```

**Match 3 (Line 86):**
```tsx
className={`${styles.myContributionsContainer} ${
          !isContributionsDataLoaded ? styles.loading : ''
        }`}
```

**Match 4 (Line 98):**
```tsx
className={`
					${styles.communityContributionsContainer} ${
          !isLeaderboardLoaded ? styles.loading : ''
        }`}
```

---

### 📄 File: `src\features\user\Profile\PublicProfileLayout\index.tsx`

**Match 1 (Line 85):**
```tsx
className={`${styles.publicProfileLayout} ${
        !canShowLeaderboard && !isTpoProfile ? styles.noLeaderboard : ''
      } ${isProgressBarDisabled && !isTpoProfile ? styles.noProgress : ''} ${
        isTpoProfile ? styles.tpoProfile : ''
    
```

**Match 2 (Line 103):**
```tsx
className={`${styles.mapContainer} ${
              !isContributionsDataLoaded ? styles.loading : ''
            }`}
```

**Match 3 (Line 119):**
```tsx
className={`${styles.progressContainer} ${
                !isProgressDataLoaded ? styles.loading : ''
              }`}
```

**Match 4 (Line 132):**
```tsx
className={`${styles.myContributionsContainer} ${
              !isContributionsDataLoaded ? styles.loading : ''
            }`}
```

**Match 5 (Line 145):**
```tsx
className={`${styles.communityContributionsContainer} ${
                !isLeaderboardLoaded ? styles.loading : ''
              }`}
```

---

### 📄 File: `src\features\user\Profile\PublicProfileOuterContainer\index.tsx`

**Match 1 (Line 10):**
```tsx
className={`${styles.mainContainer} ${
        isImpersonationModeOn ? styles.impersonationMode : ''
      }`}
```

---

### 📄 File: `src\features\user\RegisterTrees\RegisterTreesWidget.tsx`

**Match 1 (Line 339):**
```tsx
className={`${styles.locationMap}`}
```

---

### 📄 File: `src\features\user\Settings\ApiKey\ApiKeyForm.tsx`

**Match 1 (Line 26):**
```tsx
const EyeButton = ({ isVisible, onClick }: EyeButtonParams) => {
  return (
    <div className={styles.eyeButton} onClick={onClick}>
      {isVisible ? <EyeIcon /> : <EyeDisabled />}
    </div>
  );
```

---

### 📄 File: `src\features\user\TreeMapper\Analytics\components\Container\index.tsx`

**Match 1 (Line 39):**
```tsx
className={
          flexDirection === 'row'
            ? styles.headerFlexRow
            : styles.headerFlexColumn
        }
```

**Match 2 (Line 48):**
```tsx
className={overrideBodyStyles ? overrideBodyStyles : styles.body}
```

**Match 3 (Line 29):**
```tsx
const Container = ({
  leftElement,
  rightElement,
  children,
  flexDirection = 'row',
  overrideBodyStyles = null,
}: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={
          flexDirection =
```

---

### 📄 File: `src\features\user\TreeMapper\components\InterventionPage.tsx`

**Match 1 (Line 170):**
```tsx
className={`${styles.projectImageSliderContainer}`}
```

**Match 2 (Line 92):**
```tsx
const renderHistoryValues = (
    history: typeof selectedIntervention.history,
    key: 'height' | 'width',
    unit: 'm' | 'cm'
  ) =>
    history.map((h, index) => (
      <div className={styles.value} key={`${key}-${index}`}>
        {h.st
```

---

### 📄 File: `src\features\user\TreeMapper\components\Map.tsx`

**Match 1 (Line 307):**
```tsx
className={`${styles.single} ${
                              str.id === selectedIntervention?.id
                                ? styles.singleSelected
                                : ''
                            }`}
```

**Match 2 (Line 335):**
```tsx
className={`${styles.single} ${
                      intervention.id === selectedIntervention?.id
                        ? styles.singleSelected
                        : ''
                    }`}
```

---

### 📄 File: `src\features\user\TreeMapper\components\TreemapperIntervention.tsx`

**Match 1 (Line 70):**
```tsx
className={`${styles.singleLocation}`}
```

---

### 📄 File: `src\features\user\TreeMapper\components\TreeMapperList.tsx`

**Match 1 (Line 35):**
```tsx
className={`${selectedIntervention ? styles.hideOnMobile : ''}
```

**Match 2 (Line 35):**
```tsx
className={`${selectedIntervention ? styles.hideOnMobile : ''} ${
        styles.locationList
      }`}
```

---

### 📄 File: `src\features\user\TreeMapper\Import\components\PlantingLocation.tsx`

**Match 1 (Line 124):**
```tsx
className={`${styles.speciesDeleteField} ${styles.deleteActive}`}
```

**Match 2 (Line 467):**
```tsx
className={`${styles.importTab}`}
```

**Match 3 (Line 507):**
```tsx
className={`${styles.formFieldLarge}`}
```

**Match 4 (Line 343):**
```tsx
const getMethod = (method: string) => {
    switch (method) {
      case 'import':
        return (
          <>
            <label
              htmlFor="upload"
              className={styles.fileUploadContainer}
              {...getRootP
```

---

### 📄 File: `src\features\user\TreeMapper\Import\components\ReviewSubmit.tsx`

**Match 1 (Line 131):**
```tsx
className={`${styles.formField}`}
```

---

### 📄 File: `src\tenants\common\LeaderBoard\index.tsx`

**Match 1 (Line 28):**
```tsx
className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

**Match 2 (Line 39):**
```tsx
className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

---

### 📄 File: `src\tenants\planet\LeaderBoard\components\Score.tsx`

**Match 1 (Line 74):**
```tsx
className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

**Match 2 (Line 85):**
```tsx
className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

**Match 3 (Line 96):**
```tsx
className={
                selectedTab === 'search'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

---

### 📄 File: `src\tenants\salesforce\Home\components\ClimateAction.tsx`

**Match 1 (Line 50):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colMd4} ${styles.climateActionContent}`}
```

**Match 2 (Line 66):**
```tsx
className={`${gridStyles.gridRow} ${styles.climateActionDonate} ${gridStyles.justifyContentCenter}`}
```

**Match 3 (Line 68):**
```tsx
className={`${gridStyles.col8} ${gridStyles.colMd12}`}
```

---

### 📄 File: `src\tenants\salesforce\Home\components\ContentSection.tsx`

**Match 1 (Line 6):**
```tsx
className={`${styles.contentSectionContainer}`}
```

**Match 2 (Line 7):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.contentSection}`}
```

**Match 3 (Line 9):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 11):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 24):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 6 (Line 27):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
```

**Match 7 (Line 36):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

**Match 8 (Line 51):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 9 (Line 54):**
```tsx
className={`${gridStyles.colMd7} ${gridStyles.col12} ${gridStyles.orderSm1} ${gridStyles.orderMd0} ${styles.justifyContentCenter}`}
```

**Match 10 (Line 95):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.col12} ${gridStyles.orderSm0} ${gridStyles.orderMd1}`}
```

---

### 📄 File: `src\tenants\salesforce\Home\components\GrowingImpact.tsx`

**Match 1 (Line 119):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg3} ${gridStyles.colMd6} ${styles.climateActionContent}`}
```

**Match 2 (Line 124):**
```tsx
className={`${styles.partnerLogo}`}
```

**Match 3 (Line 128):**
```tsx
className={`${styles.imageContainer}`}
```

**Match 4 (Line 132):**
```tsx
className={`${styles.contentContainer}`}
```

**Match 5 (Line 167):**
```tsx
className={`${styles.foliage}`}
```

---

### 📄 File: `src\tenants\salesforce\Home\components\LeaderBoardSection.tsx`

**Match 1 (Line 26):**
```tsx
className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

**Match 2 (Line 37):**
```tsx
className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
```

---

### 📄 File: `src\tenants\salesforce\Home\components\SeaOfTrees.tsx`

**Match 1 (Line 12):**
```tsx
className={`${styles.seaOfTreesContainer}`}
```

**Match 2 (Line 13):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.seaOfTrees}`}
```

**Match 3 (Line 15):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 17):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 60):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.seaOfTreesImagesContainer}`}
```

**Match 6 (Line 62):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.col12}`}
```

**Match 7 (Line 69):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.col12}`}
```

**Match 8 (Line 76):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.col12}`}
```

**Match 9 (Line 85):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 10 (Line 87):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 11 (Line 92):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 12 (Line 94):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

---

### 📄 File: `src\tenants\salesforce\Home\components\Timeline.tsx`

**Match 1 (Line 78):**
```tsx
className={`${styles.timelineContent} ${gridStyles.colMd6}`}
```

**Match 2 (Line 161):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.timelineRow}`}
```

**Match 3 (Line 167):**
```tsx
className={`${styles.timelineButtonArrowPrev} ${styles.showDesktop}`}
```

**Match 4 (Line 184):**
```tsx
className={`${styles.timelineButtonArrowPrev} ${styles.showMobile}`}
```

**Match 5 (Line 201):**
```tsx
className={`${styles.timelineContent} ${styles.timelineMoment}`}
```

**Match 6 (Line 233):**
```tsx
className={`${styles.timelineButtonArrowNext} ${styles.showMobile}`}
```

**Match 7 (Line 250):**
```tsx
className={`${styles.timelineButtonArrowNext} ${styles.showDesktop}`}
```

---

### 📄 File: `src\tenants\salesforce\Mangroves\components\AdditionalContent.tsx`

**Match 1 (Line 9):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter}`}
```

**Match 2 (Line 12):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
```

**Match 3 (Line 20):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
```

**Match 4 (Line 28):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
```

---

### 📄 File: `src\tenants\salesforce\Mangroves\components\BlueCarbon.tsx`

**Match 1 (Line 7):**
```tsx
className={`${styles.blueCarbonContainer}`}
```

**Match 2 (Line 8):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.blueCarbon}`}
```

**Match 3 (Line 10):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.calloutContainer}`}
```

**Match 4 (Line 13):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colMd8} ${styles.helpOutCallout}`}
```

**Match 5 (Line 15):**
```tsx
className={`${styles.calloutContentContainer}`}
```

**Match 6 (Line 56):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 7 (Line 59):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
```

**Match 8 (Line 61):**
```tsx
className={`${gridStyles.circularContainer}`}
```

**Match 9 (Line 69):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12}`}
```

---

### 📄 File: `src\tenants\salesforce\Mangroves\components\ContentSection.tsx`

**Match 1 (Line 11):**
```tsx
className={`${styles.contentSectionContainer}`}
```

**Match 2 (Line 12):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.contentSection}`}
```

**Match 3 (Line 14):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 17):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12} ${gridStyles.textCenter}`}
```

**Match 5 (Line 35):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.mbIntro}`}
```

**Match 6 (Line 38):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12} ${styles.introCTA}`}
```

**Match 7 (Line 40):**
```tsx
className={`${gridStyles.circularContainer}`}
```

**Match 8 (Line 58):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

**Match 9 (Line 201):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 10 (Line 203):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 11 (Line 204):**
```tsx
className={`${styles.contentSectionQuote} ${styles.bold}`}
```

**Match 12 (Line 215):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100} ${styles.calloutContainer}`}
```

**Match 13 (Line 218):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colMd8} ${styles.justifyContentCenter} ${styles.mbCallout}`}
```

**Match 14 (Line 220):**
```tsx
className={`${styles.calloutContentContainer}`}
```

---

### 📄 File: `src\tenants\salesforce\Mangroves\components\ProjectGrid.tsx`

**Match 1 (Line 86):**
```tsx
className={`${styles.projectItem}`}
```

**Match 2 (Line 100):**
```tsx
className={`${styles.projectGridContainer}`}
```

**Match 3 (Line 101):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.projectGrid}`}
```

**Match 4 (Line 103):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 5 (Line 105):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 6 (Line 113):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${styles.projectList}`}
```

---

### 📄 File: `src\tenants\salesforce\OceanforceCampaign\components\AdditionalContent.tsx`

**Match 1 (Line 9):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter}`}
```

**Match 2 (Line 12):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
```

**Match 3 (Line 17):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
```

**Match 4 (Line 22):**
```tsx
className={`${gridStyles.col12} ${gridStyles.colLg4} ${gridStyles.colMd6}`}
```

---

### 📄 File: `src\tenants\salesforce\OceanforceCampaign\components\ContentSection.tsx`

**Match 1 (Line 53):**
```tsx
className={`${styles.contentSectionContainer}`}
```

**Match 2 (Line 54):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.contentSection}`}
```

**Match 3 (Line 56):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 58):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 60):**
```tsx
className={`${styles.contentSectionSubhead} ${styles.bold}`}
```

**Match 6 (Line 63):**
```tsx
className={`${styles.contentSectionSubhead}`}
```

**Match 7 (Line 71):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 8 (Line 74):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12} ${gridStyles.textCenter}`}
```

**Match 9 (Line 84):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 10 (Line 87):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
```

**Match 11 (Line 96):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

**Match 12 (Line 111):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 13 (Line 113):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 14 (Line 114):**
```tsx
className={`${styles.contentSectionQuote}`}
```

**Match 15 (Line 125):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 16 (Line 128):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

**Match 17 (Line 150):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg4} ${gridStyles.col12}`}
```

---

### 📄 File: `src\tenants\salesforce\OceanforceCampaign\components\LeaderBoardSection.tsx`

**Match 1 (Line 42):**
```tsx
className={
                  selectedTab === 'recent'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

**Match 2 (Line 53):**
```tsx
className={
                  selectedTab === 'highest'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

---

### 📄 File: `src\tenants\salesforce\OceanforceCampaign\components\ParticipationSection.tsx`

**Match 1 (Line 6):**
```tsx
className={`${styles.participationSectionContainer}`}
```

**Match 2 (Line 8):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.participationSection}`}
```

**Match 3 (Line 11):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 14):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12} ${styles.justifyContentCenter} ${styles.participationInfo}`}
```

**Match 5 (Line 49):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg4} ${gridStyles.col12}`}
```

---

### 📄 File: `src\tenants\salesforce\TreeCounter\index.tsx`

**Match 1 (Line 22):**
```tsx
className={`${treeCounterStyles.treeCounter} ${
        isLight ? treeCounterStyles.treeCounterLight : ''
      } ${
        (shouldShowMillions && estMillionTreesPlanted >= 0) ||
        (!shouldShowMillions && planted >= 0)
          ? treeCou
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2023\components\AdditionalInfo.tsx`

**Match 1 (Line 14):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 2 (Line 16):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 3 (Line 43):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 4 (Line 45):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 64):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 6 (Line 66):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 7 (Line 80):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter} ${styles.logoContainer}`}
```

**Match 8 (Line 83):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter} ${styles.logoContainer}`}
```

**Match 9 (Line 88):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2023\components\ContentSection.tsx`

**Match 1 (Line 8):**
```tsx
className={`${styles.contentSectionContainer}`}
```

**Match 2 (Line 9):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.contentSection}`}
```

**Match 3 (Line 11):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 13):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 30):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 6 (Line 33):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
```

**Match 7 (Line 42):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2023\components\LeaderBoardSection.tsx`

**Match 1 (Line 42):**
```tsx
className={
                  selectedTab === 'recent'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

**Match 2 (Line 53):**
```tsx
className={
                  selectedTab === 'highest'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2023\components\ProjectGrid.tsx`

**Match 1 (Line 50):**
```tsx
className={`${styles.projectItem}`}
```

**Match 2 (Line 66):**
```tsx
className={`${styles.projectGridContainer}`}
```

**Match 3 (Line 67):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.projectGrid}`}
```

**Match 4 (Line 69):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 5 (Line 71):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 6 (Line 79):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${styles.projectList}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2024\components\AdditionalInfo.tsx`

**Match 1 (Line 14):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 2 (Line 16):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 3 (Line 43):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 4 (Line 45):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 64):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 6 (Line 66):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 7 (Line 80):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter} ${styles.logoContainer}`}
```

**Match 8 (Line 83):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter} ${styles.logoContainer}`}
```

**Match 9 (Line 88):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2024\components\ContentSection.tsx`

**Match 1 (Line 8):**
```tsx
className={`${styles.contentSectionContainer}`}
```

**Match 2 (Line 9):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.contentSection}`}
```

**Match 3 (Line 11):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 13):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 33):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 6 (Line 36):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
```

**Match 7 (Line 45):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2024\components\LeaderBoardSection.tsx`

**Match 1 (Line 42):**
```tsx
className={
                  selectedTab === 'recent'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

**Match 2 (Line 53):**
```tsx
className={
                  selectedTab === 'highest'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2024\components\ProjectGrid.tsx`

**Match 1 (Line 50):**
```tsx
className={`${styles.projectItem}`}
```

**Match 2 (Line 66):**
```tsx
className={`${styles.projectGridContainer}`}
```

**Match 3 (Line 67):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.projectGrid}`}
```

**Match 4 (Line 69):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 5 (Line 71):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 6 (Line 79):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${styles.projectList}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2025\components\AdditionalInfo.tsx`

**Match 1 (Line 14):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 2 (Line 16):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 3 (Line 40):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 4 (Line 42):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 63):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 6 (Line 65):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 7 (Line 82):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter} ${styles.logoContainer}`}
```

**Match 8 (Line 85):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter} ${styles.logoContainer}`}
```

**Match 9 (Line 94):**
```tsx
className={`${gridStyles.colMd3} ${gridStyles.justifyContentCenter} ${gridStyles.alignItemsCenter}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2025\components\ContentSection.tsx`

**Match 1 (Line 6):**
```tsx
className={`${styles.contentSectionContainer}`}
```

**Match 2 (Line 7):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.contentSection}`}
```

**Match 3 (Line 9):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 4 (Line 11):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 5 (Line 33):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${gridStyles.mb65100}`}
```

**Match 6 (Line 36):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg3} ${gridStyles.col12}`}
```

**Match 7 (Line 45):**
```tsx
className={`${gridStyles.colMd6} ${gridStyles.colLg6} ${gridStyles.col12} ${styles.justifyContentCenter}`}
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2025\components\LeaderBoardSection.tsx`

**Match 1 (Line 42):**
```tsx
className={
                  selectedTab === 'recent'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

**Match 2 (Line 53):**
```tsx
className={
                  selectedTab === 'highest'
                    ? styles.leaderBoardTableHeaderTitleSelected
                    : styles.leaderBoardTableHeaderTitle
                }
```

---

### 📄 File: `src\tenants\salesforce\VTOCampaign2025\components\ProjectGrid.tsx`

**Match 1 (Line 50):**
```tsx
className={`${styles.projectItem}`}
```

**Match 2 (Line 65):**
```tsx
className={`${styles.projectGridContainer}`}
```

**Match 3 (Line 66):**
```tsx
className={`${gridStyles.fluidContainer} ${styles.projectGrid}`}
```

**Match 4 (Line 68):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter}`}
```

**Match 5 (Line 70):**
```tsx
className={`${gridStyles.colMd8} ${gridStyles.col12}`}
```

**Match 6 (Line 78):**
```tsx
className={`${gridStyles.gridRow} ${gridStyles.justifyContentCenter} ${styles.projectList}`}
```

---

