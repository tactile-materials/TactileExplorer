$(document).ready(function() {
    const PLAYLIST_ID = 'PLPDiBuu9QLZbC1oiZnqAdoVHIMKcNvsLS';
    const API_KEY = 'AIzaSyBPmtjOU7k9Bww0xM7CMIQ1huvIQvEYt_k';
    const MAX_RESULTS = 50;
    let videoViewCount = 0;

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

    // Add this function inside your $(document).ready(function() { block, before setting up event handlers
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

// Then your reset handler should work as intended:
$('#reset-filters').click(function() {
    // Reset checkboxes
    $('.filter-checkbox').prop('checked', false);
    
    // Reset thickness slider
    $("#thickness-range").slider("values", [0, 0.5]);
    
    // Reset thickness input fields
    $("#thickness-min").val("0.000");
    $("#thickness-max").val("0.500");
    
    // Update dropdown labels
    updateDropdownLabels();
    
    // Show all videos
    $('.video-item').each(function() {
        $(this).show();
    });
});

    function parseVideoTitle(title) {
        console.log('=== Video Title Parsing ===');
        console.log('Original title:', title);
        
        const parts = title.split(',').map(part => part.trim());
        console.log('Parts after split:', parts);
        
        const thickness = parts[0];
        const material = parts[1] ? parts[1].toLowerCase() : '';
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

    function formatVideoTitle(video) {
        if (!video || !video.material || !video.alloy) {
            console.log('Invalid video data:', video);
            return 'Material Properties Demonstration';
        }

        const material = (video.material || '').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        const alloy = (video.alloy || '').includes('nylon') ? 
            (video.alloy || '').split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ') : 
            (video.alloy || '').toUpperCase();
        const thickness = video.thickness || '';
        
        return `${material} ${alloy} (${thickness}") Material Properties Demonstration`;
    }

    function formatVideoAlt(video) {
        if (!video || !video.material || !video.alloy) {
            return 'Material test video';
        }

        const material = (video.material || '').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        const alloy = (video.alloy || '').includes('nylon') ? 
            (video.alloy || '').split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ') : 
            (video.alloy || '').toUpperCase();
        
        return `${material} ${alloy} material test video showing physical properties`;
    }

    function formatAriaLabel(video) {
        if (!video || !video.material || !video.alloy) {
            return 'Material properties demonstration video';
        }

        const material = (video.material || '').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        const alloy = (video.alloy || '').includes('nylon') ? 
            (video.alloy || '').split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ') : 
            (video.alloy || '').toUpperCase();
        const thickness = video.thickness || '';
        
        return `Video demonstration of ${material} ${alloy} material properties, thickness ${thickness} inches`;
    }

    function populateFilterOptions(videoData) {
        const materials = new Set();
        const alloys = new Set();
        
        // Populate the Sets first
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

    function initGallery() {
        fetchYouTubeVideos().then(videoData => {
            // Populate filter options first
            populateFilterOptions(videoData);            
            // Clear and populate gallery
            $('.gallery').empty();
            
            videoData.forEach((video) => {
                const formattedTitle = formatVideoTitle(video);
                const formattedAlt = formatVideoAlt(video);
                const formattedAriaLabel = formatAriaLabel(video);

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
                            <img src="${video.thumbnail}" 
                                title="${formattedTitle}"
                                alt="${formattedAlt}"
                                aria-label="${formattedAriaLabel}" />
                        </div>
                        <div class="video-info">
                            <div class="video-tags">
                                <span class="tag">${video.material.replace('-', ' ')}</span>
                                <span class="tag">${video.alloy}</span>
                                <span class="tag">${video.thickness}</span>
                            </div>
                        </div>
                    </div>
                `);
            });
        }).catch(error => {
            console.error('Error fetching videos:', error);
            $('.gallery').html('<p>Error loading videos. Please try again later.</p>');
        });
    }

    function showWaitlistPopup() {
        if ($('#waitlist-popup').length) return;

        $('body').append(`
            <div id="waitlist-popup" class="popup-overlay">
                <div class="popup-content">
                    <div class="popup-header">
                        <button class="close-popup">&times;</button>
                    </div>
                    <div class="popup-body">
                        <div class="google-form-container">
                            <iframe src="https://forms.gle/fyBFM2qxMTon8YDu5"
                                frameborder="0"
                                marginheight="0"
                                marginwidth="0"
                                style="width:100%;height:1000px;">
                                Loading...
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $('#waitlist-popup').css('display', 'flex').hide().fadeIn();

        $('.close-popup').on('click', function() {
            $('#waitlist-popup').fadeOut(function() {
                $(this).remove();
            });
        });

        $('#waitlist-popup').on('click', function(e) {
            if (e.target === this) {
                $(this).fadeOut(function() {
                    $(this).remove();
                });
            }
        });
    }

    // Video click handler
    $(document).on('click', '.video-overlay', function() {
        const videoItem = $(this).closest('.video-item');
        const videoId = videoItem.attr('data-video-id');
        const videoContainer = videoItem.find('.video-container');
        
        $(this).remove();
        videoContainer.find('img').remove();
        
        const iframe = $('<iframe>', {
            src: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
            frameborder: '0',
            allowfullscreen: true
        });
        
        videoContainer.append(iframe);

        // Increment view counter and check for popup
        videoViewCount++;
        if (videoViewCount === 2) {
            setTimeout(showWaitlistPopup, 1000);
        }
    });

    // Initialize thickness range slider
    $("#thickness-range").slider({
        range: true,
        min: 0,
        max: 0.5,
        step: 0.001,
        values: [0, 0.5],
        slide: function(event, ui) {
            updateThicknessInputs(ui.values[0], ui.values[1]);
            const checkedMaterials = $('.material-checkbox:checked').map(function() {
                return $(this).attr('data-filter');
            }).get();
            
            const checkedAlloys = $('.alloy-checkbox:checked').map(function() {
                return $(this).attr('data-filter');
            }).get();
            
            applyFilters(checkedMaterials, checkedAlloys);
        }
    });

    function updateThicknessInputs(min, max) {
        $("#thickness-min").val(min.toFixed(3));
        $("#thickness-max").val(max.toFixed(3));
    }

    // Update the applyFilters function
function applyFilters(checkedMaterials = [], checkedAlloys = []) {
    // Get current thickness range values
    const minThickness = parseFloat($("#thickness-min").val()) || 0;
    const maxThickness = parseFloat($("#thickness-max").val()) || 0.5;
    
    console.log('Applying filters:', {
        materials: checkedMaterials,
        alloys: checkedAlloys,
        thickness: { min: minThickness, max: maxThickness }
    });
    
    $('.video-item').each(function() {
        const $item = $(this);
        const material = String($item.attr('data-material') || '').toLowerCase().trim();
        const alloy = String($item.attr('data-alloy') || '').toLowerCase().trim();
        const thickness = parseFloat($item.attr('data-thickness')) || 0;
        
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

// Update the reset filters click handler
$('#reset-filters').click(function() {
    // Reset checkboxes
    $('.filter-checkbox').prop('checked', false);
    
    // Reset thickness slider
    $("#thickness-range").slider("values", [0, 0.5]);
    
    // Reset thickness input fields
    $("#thickness-min").val("0.000");
    $("#thickness-max").val("0.500");
    
    // Update dropdown labels
    updateDropdownLabels();
    
    // Force the filter function to use the reset values
    const minThickness = 0;
    const maxThickness = 0.5;
    
    // Show all videos by applying filter with reset values
    $('.video-item').each(function() {
        $(this).show();
    });
});

    // Event handlers
    $(document).on('click', '.dropdown-toggle', function(e) {
        e.stopPropagation();
        const menu = $(this).siblings('.dropdown-menu');
        $('.dropdown-menu').not(menu).removeClass('show');
        menu.toggleClass('show');
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.dropdown-container').length) {
            $('.dropdown-menu').removeClass('show');
        }
    });

    $(document).on('click', '.done-button', function(e) {
        e.stopPropagation();
        const checkedMaterials = $('.material-checkbox:checked').map(function() {
            return $(this).attr('data-filter');
        }).get();
        
        const checkedAlloys = $('.alloy-checkbox:checked').map(function() {
            return $(this).attr('data-filter');
        }).get();
        
        $(this).closest('.dropdown-menu').removeClass('show');
        applyFilters(checkedMaterials, checkedAlloys);
        updateDropdownLabels();
    });

    $(document).on('click', '.checkbox-options', function(e) {
        e.stopPropagation();
    });

    $(document).on('change', '.filter-checkbox', function() {
        updateDropdownLabels();
    });

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

    // Replace your existing reset filters click handler with this:
$('#reset-filters').click(function() {
    // Reset checkboxes
    $('.filter-checkbox').prop('checked', false);
    
    // Reset thickness slider and trigger update
    $("#thickness-range").slider("values", [0, 0.5])
                        .slider("option", "values", [0, 0.5]);  // Force slider refresh
    
    // Reset thickness input fields
    $("#thickness-min").val("0.000");
    $("#thickness-max").val("0.500");
    
    // Trigger slide event to update visuals
    $("#thickness-range").trigger("slide");
    
    // Update dropdown labels
    updateDropdownLabels();
    
    // Apply filters with empty arrays
    applyFilters([], []);
});

    // Initialize the gallery
    initGallery();
});