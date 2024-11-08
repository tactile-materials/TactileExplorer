$(document).ready(function() {
    const PLAYLIST_ID = 'PLPDiBuu9QLZbC1oiZnqAdoVHIMKcNvsLS';
    const API_KEY = 'AIzaSyBPmtjOU7k9Bww0xM7CMIQ1huvIQvEYt_k';
    const MAX_RESULTS = 50;

    function fetchYouTubeVideos() {
        console.log('Fetching videos from playlist...');
        
        return $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/playlistItems',
            data: {
                key: API_KEY,
                playlistId: PLAYLIST_ID,
                part: 'snippet',
                maxResults: MAX_RESULTS
            }
        }).then(response => {
            console.log('Videos Response:', response);
            return response.items.map(item => {
                const title = item.snippet.title;
                const tags = parseVideoTitle(title);
                return {
                    id: item.snippet.resourceId.videoId,
                    title: title,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    ...tags
                };
            });
        }).catch(error => {
            console.error('API Error:', error);
            throw error;
        });
    }
    function populateFilterOptions(videoData) {
        const materials = new Set();
        const alloys = new Set();
        
        videoData.forEach(video => {
            if (video.material) materials.add(video.material.toLowerCase().trim());
            if (video.alloy) alloys.add(video.alloy.toLowerCase().trim());
        });
        
        // Clear existing options
        $('#material-menu .checkbox-options').empty();
        $('#alloy-menu .checkbox-options').empty();
        
        // Populate material options
        materials.forEach(material => {
            const displayMaterial = material.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
                
            $('#material-menu .checkbox-options').append(`
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="filter-checkbox material-checkbox" 
                           data-filter="${material}" id="material-${material.replace(/\s+/g, '-')}">
                    <label for="material-${material.replace(/\s+/g, '-')}">${displayMaterial}</label>
                </div>
            `);
        });
        
        // Populate alloy options
        alloys.forEach(alloy => {
            // Check if the alloy is a polymer (contains the word 'nylon')
            const displayAlloy = alloy.includes('nylon') ? 
                alloy.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ') : 
                alloy.toUpperCase();
    
            $('#alloy-menu .checkbox-options').append(`
                <div class="checkbox-wrapper">
                    <input type="checkbox" class="filter-checkbox alloy-checkbox" 
                           data-filter="${alloy}" id="alloy-${alloy.replace(/\s+/g, '-')}">
                    <label for="alloy-${alloy.replace(/\s+/g, '-')}">${displayAlloy}</label>
                </div>
            `);
        });
    }

    // Replace the existing parseVideoTitle function with this:
function parseVideoTitle(title) {
    console.log('=== Video Title Parsing ===');
    console.log('Original title:', title);
    
    const parts = title.split(',').map(part => part.trim());
    console.log('Parts after split:', parts);
    
    const thickness = parts[0];
    const material = parts[1] ? parts[1].toLowerCase() : '';
    // Extract alloy, removing any extra spaces and converting to lowercase
    const alloy = parts[2] ? parts[2].toLowerCase().trim() : '';
    
    console.log('Individual parts:', {
        thickness,
        material,
        alloy
    });

    return {
        thickness: thickness,
        material: material,
        alloy: alloy
    };
}

    // Replace your entire initGallery function with this version
function initGallery() {
    fetchYouTubeVideos().then(videoData => {
        // Populate filter options first
        populateFilterOptions(videoData);
        
        // Clear and populate gallery
        $('.gallery').empty();
        
        videoData.forEach((video) => {
            console.log('Adding video to gallery:', video);
            $('.gallery').append(`
                <div class="video-item" 
                    data-material="${video.material}" 
                    data-alloy="${video.alloy}" 
                    data-thickness="${video.thickness}" 
                    data-video-id="${video.id}">
                    <div class="video-container">
                        <div class="video-overlay">
                            <div class="overlay-text">${video.title}</div>
                            <div class="play-button"></div>
                        </div>
                        <img src="${video.thumbnail}" alt="${video.title}" />
                    </div>
                    <div class="video-info">
                        <div class="video-tags">
                            <span class="tag">${video.material.replace('-', ' ')}</span>
                            <span class="tag">${video.alloy}</span>
                            <span class="tag">${video.thickness}</span>
                        </div>
                    </div>
                    <!-- <div class="affiliate-link">
                        <a href="#" target="_blank">Buy ${video.title} here!</a>
                    </div>
                </div>
            `);
        });

        // Debug logging for first created video
        console.log('Created video item:', {
            title: videoData[0].title,
            parsedAlloy: videoData[0].alloy,
            dataAttribute: $('.video-item').first().attr('data-alloy')
        });

    }).catch(error => {
        console.error('Error fetching videos:', error);
        $('.gallery').html('<p>Error loading videos. Please try again later.</p>');
    });
}

    // Video click handler
    $(document).on('click', '.video-overlay', function() {
        const videoItem = $(this).closest('.video-item');
        const videoId = videoItem.data('video-id');
        const videoContainer = videoItem.find('.video-container');
        
        $(this).remove();
        videoContainer.find('img').remove();
        const iframe = $(`<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`);
        videoContainer.append(iframe);
    });

    // Initialize the gallery
    initGallery();

    // Initialize thickness range slider
    $("#thickness-range").slider({
        range: true,
        min: 0,
        max: 0.5,
        step: 0.001,
        values: [0, 0.5],
        slide: function(event, ui) {
            updateThicknessInputs(ui.values[0], ui.values[1]);
            // Get current filter selections
            const checkedMaterials = $('.material-checkbox:checked').map(function() {
                return $(this).attr('data-filter');
            }).get();
            
            const checkedAlloys = $('.alloy-checkbox:checked').map(function() {
                return $(this).attr('data-filter');
            }).get();
            
            applyFilters(checkedMaterials, checkedAlloys);
        }
    });

    // Dropdown functionality
    $(document).on('click', '.dropdown-toggle', function(e) {
        e.stopPropagation();
        const menu = $(this).siblings('.dropdown-menu');
        $('.dropdown-menu').not(menu).removeClass('show');
        menu.toggleClass('show');
    });

    // Close dropdown when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.dropdown-container').length) {
            $('.dropdown-menu').removeClass('show');
        }
    });

    // Done button handler
    $(document).on('click', '.done-button', function(e) {
        e.stopPropagation();
        
        // Store checkbox states before closing dropdown
        const checkedMaterials = $('.material-checkbox:checked').map(function() {
            return $(this).attr('data-filter');  // Changed from .data('filter')
        }).get();
        
        const checkedAlloys = $('.alloy-checkbox:checked').map(function() {
            return $(this).attr('data-filter');  // Changed from .data('filter')
        }).get();
        
        // Close dropdown
        $(this).closest('.dropdown-menu').removeClass('show');
        
        applyFilters(checkedMaterials, checkedAlloys);
        updateDropdownLabels();
    });

    // Prevent dropdown from closing when clicking checkboxes
    $(document).on('click', '.checkbox-options', function(e) {
        e.stopPropagation();
    });

    // Handle checkbox changes
    $(document).on('change', '.filter-checkbox', function() {
        updateDropdownLabels();
    });

    function updateDropdownLabels() {
        const materialText = $('.material-checkbox:checked').map(function() {
            return $(this).siblings('label').text().trim();
        }).get().join(', ') || 'Select Materials';
        
        const alloyText = $('.alloy-checkbox:checked').map(function() {
            return $(this).siblings('label').text().trim();
        }).get().join(', ') || 'Select Alloys';
        
        $('#material-filters .dropdown-toggle').text(materialText);
        $('#alloy-filters .dropdown-toggle').text(alloyText);
    }

    function updateThicknessInputs(min, max) {
        $("#thickness-min").val(min.toFixed(3));
        $("#thickness-max").val(max.toFixed(3));
    }

   // Replace the existing applyFilters function
function applyFilters(checkedMaterials = [], checkedAlloys = []) {
    console.log('Applying filters:', {
        materials: checkedMaterials,
        alloys: checkedAlloys
    });
    
    // Get current thickness range values
    const minThickness = parseFloat($("#thickness-min").val()) || 0;
    const maxThickness = parseFloat($("#thickness-max").val()) || 0.5;
    
    console.log('Thickness range:', { minThickness, maxThickness });
    
    $('.video-item').each(function() {
        const $item = $(this);
        const material = String($item.attr('data-material') || '').toLowerCase().trim();
        const alloy = String($item.attr('data-alloy') || '').toLowerCase().trim();
        const thickness = parseFloat($item.attr('data-thickness')) || 0;
        
        console.log('Video item data:', {
            material,
            alloy,
            thickness,
            materialMatch: checkedMaterials.length === 0 || checkedMaterials.map(m => m.toLowerCase().trim()).includes(material),
            alloyMatch: checkedAlloys.length === 0 || checkedAlloys.map(a => a.toLowerCase().trim()).includes(alloy),
            thicknessMatch: thickness >= minThickness && thickness <= maxThickness
        });
        
        const materialMatch = checkedMaterials.length === 0 || 
                            checkedMaterials.map(m => m.toLowerCase().trim()).includes(material);
        const alloyMatch = checkedAlloys.length === 0 || 
                          checkedAlloys.map(a => a.toLowerCase().trim()).includes(alloy);
        const thicknessMatch = thickness >= minThickness && thickness <= maxThickness;
        
        if (materialMatch && alloyMatch && thicknessMatch) {
            $item.show();
        } else {
            $item.hide();
        }
    });
}

    // Handle thickness input changes
    $("#thickness-min, #thickness-max").on('input', function() {
    const min = parseFloat($("#thickness-min").val()) || 0;
    const max = parseFloat($("#thickness-max").val()) || 0.5;
    
    if ($(this).attr('id') === 'thickness-min' && min > max) {
        $(this).val(max);
        return;
    }
    if ($(this).attr('id') === 'thickness-max' && max < min) {
        $(this).val(min);
        return;
    }

    $("#thickness-range").slider("values", [min, max]);
    
    // Get current filter selections
    const checkedMaterials = $('.material-checkbox:checked').map(function() {
        return $(this).attr('data-filter');
    }).get();
    
    const checkedAlloys = $('.alloy-checkbox:checked').map(function() {
        return $(this).attr('data-filter');
    }).get();
    
    applyFilters(checkedMaterials, checkedAlloys);
});

    $("#thickness-min, #thickness-max").on('blur', function() {
        let value = parseFloat($(this).val()) || 0;
        value = Math.max(0, Math.min(1, value));
        $(this).val(value.toFixed(3));
    });

    // Reset filters
    $('#reset-filters').click(function() {
        $('.filter-checkbox').prop('checked', false);
        $("#thickness-range").slider("values", [0, 0.5]);
        updateThicknessInputs(0, 0.5);
        updateDropdownLabels();
        applyFilters([], []); // Reset with empty filters
    });

    // Initialize the gallery
    initGallery();
});