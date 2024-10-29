$(document).ready(function() {
    // Clear the gallery first to prevent duplicates
    $('.gallery').empty();
    
    // Single source of video data
    const videoData = [
        {
            id: 'kGVwI77mpto',
            title: 'Aluminum, 6061, 0.031" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.031'
        },
        {
            id: 'qsReBeAHtow',
            title: 'Aluminum, 6061, 0.040" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.040'
        },
        {
            id: 'WQ8oRxfnR0o',
            title: 'Aluminum, 6061, 0.063" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.063'
        },
        {
            id: 'QNS-jMWevjE',
            title: 'Aluminum, 6061, 0.080" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.080'
        },
        {
            id: 'bfZrv7SX7KI',
            title: 'Aluminum, 6061, 0.125" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.125'
        },
        {
            id: '1nzGALBFC8Y',
            title: 'Aluminum, 6061, 0.160" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.160'
        },
        {
            id: 'ehEON_bu3So',
            title: 'Aluminum, 6061, 0.250" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.250'
        },
        {
            id: '5bbphNStxqg',
            title: 'Aluminum, 6061, 0.375" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.375'
        },
        {
            id: 'ie4d22JdT80',
            title: 'Aluminum, 6061, 0.500" thk',
            material: 'aluminum',
            alloy: '6061',
            thickness: '0.500'
        }, 
        {
            id: 'qqF7KO0PFCo',
            title: 'Stainless Steel, 304, 0.0004" thk',
            material: 'stainless steel',
            alloy: '304',
            thickness: '0.0004'
        },
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
        max: 1,
        step: 0.001,
        values: [0, 1],
        slide: function(event, ui) {
            updateThicknessInputs(ui.values[0], ui.values[1]);
            applyFilters();
        }
    });

    // Initialize thickness inputs
    const initialMin = $("#thickness-range").slider("values", 0);
    const initialMax = $("#thickness-range").slider("values", 1);
    updateThicknessInputs(initialMin, initialMax);

    function updateThicknessInputs(min, max) {
        $("#thickness-min").val(min.toFixed(3));
        $("#thickness-max").val(max.toFixed(3));
    }

    // Handle thickness input changes
    $("#thickness-min, #thickness-max").on('input', function() {
        const min = parseFloat($("#thickness-min").val()) || 0;
        const max = parseFloat($("#thickness-max").val()) || 1;
        
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

    // Select All functionality
    $('#select-all-material').change(function() {
        $('#material-filters .filter-checkbox:not(#select-all-material)').prop('checked', this.checked);
        applyFilters();
    });

    $('#select-all-alloy').change(function() {
        $('[id^="alloy-filters"] .filter-checkbox:not(#select-all-alloy)').prop('checked', this.checked);
        applyFilters();
    });

    // Filter change handler
    $('.filter-checkbox').change(applyFilters);

    // Apply filters function
    function applyFilters() {
        const selectedMaterials = $('#material-filters .filter-checkbox:not(#select-all-material):checked').map(function() {
            return $(this).data('filter');
        }).get();
    
        const selectedAlloys = $('[id^="alloy-filters"] .filter-checkbox:not(#select-all-alloy):checked').map(function() {
            return $(this).data('filter');
        }).get();
    
        const minThickness = parseFloat($("#thickness-min").val()) || 0;
        const maxThickness = parseFloat($("#thickness-max").val()) || 1;
    
        $('.video-item').each(function() {
            const material = $(this).data('material');
            const alloy = $(this).data('alloy');
            const thickness = parseFloat($(this).data('thickness'));
            
            const materialMatch = selectedMaterials.length === 0 || selectedMaterials.includes(material);
            const alloyMatch = selectedAlloys.length === 0 || selectedAlloys.includes(alloy);
            const thicknessMatch = thickness >= minThickness && thickness <= maxThickness;
            
            if (materialMatch && alloyMatch && thicknessMatch) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }    

    // Reset filters
    $('#reset-filters').click(function() {
        $('.filter-checkbox').prop('checked', false);
        $("#thickness-range").slider("values", [0, 1]);
        updateThicknessInputs(0, 1);
        $('.video-item').show();
    });
});