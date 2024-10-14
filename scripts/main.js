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
    
    // Generate 20 YouTube videos with random tags
    for (let i = 0; i < 20; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];
        const alloy = alloys[Math.floor(Math.random() * alloys.length)];
        const thickness = (Math.random() * 2).toFixed(2);
        const videoId = youtubeVideos[i];
        
        $('.gallery').append(`
            <div class="video-item" data-material="${material}" data-alloy="${alloy}" data-thickness="${thickness}">
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="video-info">
                    <h3>Material Sample ${i + 1}</h3>
                    <div class="video-tags">
                        <span class="tag">${material.replace('-', ' ')}</span>
                        <span class="tag">${alloy}</span>
                        <span class="tag">${thickness}"</span>
                    </div>
                </div>
            </div>
        `);
    }
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
    let isLoggedIn = false;
let isPaidUser = false;

function checkUserStatus() {
    // This would typically involve a server request
    // For this example, we'll use local variables
    if (isLoggedIn) {
        document.getElementById('user-status').textContent = isPaidUser ? 'Premium User' : 'Free User';
        document.getElementById('login-btn').textContent = 'Log Out';
        document.getElementById('upgrade-btn').style.display = isPaidUser ? 'none' : 'inline';
    } else {
        document.getElementById('user-status').textContent = '';
        document.getElementById('login-btn').textContent = 'Log In';
        document.getElementById('upgrade-btn').style.display = 'none';
    }
    updateContentVisibility();
}

function updateContentVisibility() {
    const premiumContent = document.querySelectorAll('.premium-content');
    premiumContent.forEach(element => {
        element.style.display = isPaidUser ? 'block' : 'none';
    });
}

document.getElementById('login-btn').addEventListener('click', function() {
    isLoggedIn = !isLoggedIn;
    checkUserStatus();
});

document.getElementById('upgrade-btn').addEventListener('click', function() {
    if (isLoggedIn && !isPaidUser) {
        // Here you would redirect to a payment page
        alert('Redirecting to payment page...');
        isPaidUser = true;
        checkUserStatus();
    }
});

checkUserStatus(); // Initial check

});
