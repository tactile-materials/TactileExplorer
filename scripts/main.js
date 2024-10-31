$(document).ready(function() {
    // Clear the gallery first to prevent duplicates
    $('.gallery').empty();
    
    // Single source of video data
    const videoData = [
        {
            id: 'kGVwI77mpto',
            title: '0.031", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.031'
        },
        {
            id: 'qsReBeAHtow',
            title: '0.040", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.040'
        },
        {
            id: 'WQ8oRxfnR0o',
            title: '0.063", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.063'
        },
        {
            id: 'QNS-jMWevjE',
            title: '0.080", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.080'
        },
        {
            id: 'bfZrv7SX7KI',
            title: '0.125", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.125'
        },
        {
            id: '1nzGALBFC8Y',
            title: '0.160", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.160'
        },
        {
            id: 'ehEON_bu3So',
            title: '0.250", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.250'
        },
        {
            id: '5bbphNStxqg',
            title: '0.375", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.375'
        },
        {
            id: 'ie4d22JdT80',
            title: '0.500", Aluminum, 6061',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.500'
        }, 
        {
            id: 'qqF7KO0PFCo',
            title: '0.0004", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.0004'
        },
        {
            id: 'Jz83iiDpn1Q',
            title: '0.25", Plastic, ABS',
            material: 'plastic',
            alloy: 'ABS',
            thickness: '0.25'
        },
        {
            id: 'kvZ13PfMPJM',
            title: '0.08", Plastic, ABS',
            material: 'plastic',
            alloy: 'ABS',
            thickness: '0.08'
        },
        {
            id: 'T1t_sRIm3zs',
            title: '0.13", Plastic, ABS',
            material: 'plastic',
            alloy: 'ABS',
            thickness: '0.13'
        },
        {
            id: 'MdthcDOoF-c',
            title: '0.002", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.002'
        },   
        {
            id: 'OQWoUxozfMM',
            title: '0.004", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.004'
        },      
        {
            id: 'RQsoJCRGGoE',
            title: '0.040", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.040'
        },     
        {
            id: 'tUrtf4mvBY0',
            title: '0.030", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.030'
        },     
        {
            id: 'b_y-2pUJndw',
            title: '0.20", Plastic, ABS',
            material: 'plastic',
            alloy: 'ABS',
            thickness: '0.20'
        },
        {
            id: 'GKLCqxx3Nfw',
            title: '0.020", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.020'
        },    
        {
            id: '9fhHzFqfkug',
            title: '0.080", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.080'
        },   
        {
            id: 'kCy8Zj-cExc',
            title: '0.008", Stainless Steel, 304',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.008'
        }
    ];

    // Generate video items
    videoData.forEach((video, index) => {
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
                </div>
                <div class="video-info">
                    <div class="video-tags">
                        <span class="tag">${video.material.replace('-', ' ')}</span>
                        <span class="tag">${video.alloy}</span>
                        <span class="tag">${video.thickness}"</span>
                    </div>
                </div>
                <div class="affiliate-link">
                    <a href="#" target="_blank">Buy ${video.title} here!</a>
                </div>
            </div>
        `);
    });

    // Video click handler
    $(document).on('click', '.video-overlay', function() {
        const videoItem = $(this).closest('.video-item');
        const videoId = videoItem.data('video-id');
        const videoContainer = videoItem.find('.video-container');
        
        $(this).remove();
        const iframe = $(`<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allowfullscreen></iframe>`);
        videoContainer.append(iframe);
        iframe.show();
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
            applyFilters();
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
        console.log('Done button clicked');
        e.stopPropagation();
        
        // Store checkbox states before closing dropdown
        const checkedMaterials = $('.material-checkbox:checked').map(function() {
            return $(this).data('filter');
        }).get();
        
        const checkedAlloys = $('.alloy-checkbox:checked').map(function() {
            return $(this).data('filter');
        }).get();
        
        // Close dropdown
        $(this).closest('.dropdown-menu').removeClass('show');
        
        console.log('Checked Materials:', checkedMaterials);
        console.log('Checked Alloys:', checkedAlloys);
        
        applyFilters(checkedMaterials, checkedAlloys);
        updateDropdownLabels();
    });
    
    function applyFilters(checkedMaterials = [], checkedAlloys = []) {
        console.log('Applying filters with:', {materials: checkedMaterials, alloys: checkedAlloys});
        
        $('.video-item').each(function() {
            const $item = $(this);
            const material = String($item.data('material') || '').toLowerCase();
            const alloy = String($item.data('alloy') || '').toLowerCase();
            const thickness = parseFloat($item.data('thickness')) || 0;
            
            const materialMatch = checkedMaterials.length === 0 || checkedMaterials.includes(material);
            const alloyMatch = checkedAlloys.length === 0 || checkedAlloys.includes(alloy);
            const thicknessMatch = true; // We'll handle thickness separately if needed
            
            if (materialMatch && alloyMatch && thicknessMatch) {
                $item.show();
            } else {
                $item.hide();
            }
        });
    }

    // Prevent dropdown from closing when clicking checkboxes
    $(document).on('click', '.checkbox-options', function(e) {
        e.stopPropagation();
    });

    // Handle checkbox changes
    $(document).on('change', '.filter-checkbox', function() {
        console.log('Checkbox changed:', $(this).data('filter'), 'Checked:', $(this).is(':checked'));
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

    // Apply filters function
    function applyFilters() {
        console.log('=== Starting Filter Application ===');
        
        // Check what's selected in materials
        const materialCheckboxes = $('#material-filters .filter-checkbox:checked');
        console.log('Number of material checkboxes checked:', materialCheckboxes.length);
        
        const selectedMaterials = materialCheckboxes.map(function() {
            const filter = $(this).data('filter');
            console.log('Material checkbox filter value:', filter);
            return String(filter).toLowerCase();
        }).get();
        console.log('Final selected materials array:', selectedMaterials);
    
        // Check what's selected in alloys
        const alloyCheckboxes = $('#alloy-filters .filter-checkbox:checked');
        console.log('Number of alloy checkboxes checked:', alloyCheckboxes.length);
        
        const selectedAlloys = alloyCheckboxes.map(function() {
            const filter = $(this).data('filter');
            console.log('Alloy checkbox filter value:', filter);
            return String(filter).toLowerCase();
        }).get();
        console.log('Final selected alloys array:', selectedAlloys);
    
        // Get thickness values
        const minThickness = parseFloat($("#thickness-min").val()) || 0;
        const maxThickness = parseFloat($("#thickness-max").val()) || 0.5;
        console.log('Thickness range:', minThickness, 'to', maxThickness);
    
        // Log total number of video items before filtering
        const totalVideos = $('.video-item').length;
        console.log('Total video items before filtering:', totalVideos);
    
        let shownCount = 0;
        let hiddenCount = 0;
    
        $('.video-item').each(function() {
            const $item = $(this);
            const material = String($item.data('material') || '').toLowerCase();
            const alloy = String($item.data('alloy') || '').toLowerCase();
            const thickness = parseFloat($item.data('thickness')) || 0;
            
            console.log('\nChecking video item:', {
                material: material,
                alloy: alloy,
                thickness: thickness
            });
            
            const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(material);
            const alloyMatch = selectedAlloys.length === 0 || selectedAlloys.includes(alloy);
            const thicknessMatch = thickness >= minThickness && thickness <= maxThickness;
            
            console.log('Match results:', {
                materialMatch: materialMatch,
                alloyMatch: alloyMatch,
                thicknessMatch: thicknessMatch
            });
    
            if (materialMatch && alloyMatch && thicknessMatch) {
                $item.show();
                shownCount++;
            } else {
                $item.hide();
                hiddenCount++;
            }
        });
    
        console.log('=== Filter Results ===');
        console.log('Videos shown:', shownCount);
        console.log('Videos hidden:', hiddenCount);
        console.log('=== End Filter Application ===');
    }
    // Initialize thickness inputs
    const initialMin = $("#thickness-range").slider("values", 0);
    const initialMax = $("#thickness-range").slider("values", 1);
    updateThicknessInputs(initialMin, initialMax);

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
        applyFilters();
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
        updateThicknessInputs(0, 1);
        updateDropdownLabels();
        $('.video-item').show();
    });
});