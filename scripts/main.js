$(document).ready(function() {
    const materials = ['stainless-steel', 'carbon-steel', 'aluminum', 'plastic'];
    const alloys = ['6061', '7075', 'a36', 'a572'];
    const youtubeVideos = [
        'dQw4w9WgXcQ', 'jNQXAC9IVRw', '6-HUgzYPm9g', 'z9Uz1icjwrM',
        'GimHHAID_P0', 'OV5_LQArLa0', 'OidS-g_KR_8', 'cZzK32Cfcq8',
        'lWA2pjMjpBs', 'hT_nvWreIhg', 'JGwWNGJdvx8', 'kJQP7kiw5Fk',
        'KDxJlW6cxRk', 'CevxZvSJLk8', 'qpgTC9MDx1o', 'DyDfgMOUjCI',
        'YMEtpOXHSIE', '_dK2tDK9grQ', 'HMUDVMiITOU', '9bZkp7q19f0'
    ];
       
    // Generate 20 video items with random tags, text overlay, and play button
    for (let i = 0; i < 20; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];
        const alloy = alloys[Math.floor(Math.random() * alloys.length)];
        const thickness = (Math.random() * 2).toFixed(2);
        const videoId = youtubeVideos[i];
        
        $('.gallery').append(`
            <div class="video-item" data-material="${material}" data-alloy="${alloy}" data-thickness="${thickness}">
                <div class="video-container">
                    <div class="video-overlay">
                        <div class="overlay-text">Material Sample ${i + 1}</div>
                        <div class="play-button">▶</div>
                    </div>
                    <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                </div>
                
            </div>
        `);
    }
    // Add click event to play the video
    $('.video-overlay').on('click', function() {
        $(this).hide();
        const iframe = $(this).siblings('iframe');
        const src = iframe.attr('src');
        iframe.attr('src', src + '?autoplay=1');
    });
    
    // Initialize thickness range slider
    $("#thickness-range").slider({
        range: true,
        min: 0,
        max: 2,
        step: 0.01,
        values: [0, 2],
        slide: function(event, ui) {
            $("#thickness-amount").text(ui.values[0] + '" - ' + ui.values[1] + '"');
            applyFilters();
        }
    });
    $("#thickness-amount").text($("#thickness-range").slider("values", 0) +
        '" - ' + $("#thickness-range").slider("values", 1) + '"');

    // Select All functionality
    $('#select-all-material').change(function() {
        $('#material-filters .filter-checkbox:not(#select-all-material)').prop('checked', this.checked);
        applyFilters();
    });

    $('#select-all-alloy').change(function() {
        $('#alloy-filters .filter-checkbox:not(#select-all-alloy)').prop('checked', this.checked);
        applyFilters();
    });

    // Apply filters automatically on checkbox change
    $('.filter-checkbox').change(applyFilters);

    // Apply filters function
    function applyFilters() {
        const selectedMaterials = $('#material-filters .filter-checkbox:not(#select-all-material):checked').map(function() {
            return $(this).data('filter');
        }).get();

        const selectedAlloys = $('#alloy-filters .filter-checkbox:not(#select-all-alloy):checked').map(function() {
            return $(this).data('filter');
        }).get();

        const thicknessRange = $("#thickness-range").slider("values");
        const minThickness = thicknessRange[0];
        const maxThickness = thicknessRange[1];

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
        $("#thickness-range").slider("values", [0, 2]);
        $("#thickness-amount").text('0" - 2"');
        $('.video-item').show();
    });
});
