$(document).ready(function() {
    const materials = ['stainless-steel', 'carbon-steel', 'aluminum', 'plastic'];
    const alloys = ['6061', '7075', 'a36', 'a572'];
    
    // Generate 20 placeholder videos
    for (let i = 1; i <= 20; i++) {
        const material = materials[Math.floor(Math.random() * materials.length)];
        const alloy = alloys[Math.floor(Math.random() * alloys.length)];
        const thickness = (Math.random() * 2).toFixed(2);
        
        $('.gallery').append(`
            <div class="video-item" data-material="${material}" data-alloy="${alloy}" data-thickness="${thickness}">
                <div class="video-container">
                    <img src="/api/placeholder/250/141" alt="placeholder" />
                </div>
                <div class="video-info">
                    <h3>Material Sample ${i}</h3>
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

function updateContentVisibility(member) {
    $('.video-item').each(function() {
        const isPremium = Math.random() < 0.3; // 30% chance of being premium content
        if (isPremium) {
            $(this).addClass('premium-content');
            if (!(member && member.subscribed)) {
                $(this).find('.video-container').html('<div class="premium-overlay">Premium Content</div>');
            }
        }
    });

    $('.premium-content').toggle(member && member.subscribed);
}
$(document).ready(function() {
    // Your existing code here

    // Memberful integration
    document.addEventListener('memberful.ready', function() {
        Memberful.checkAuth(function(member) {
            const loginBtn = document.getElementById('login-btn');
            const signupBtn = document.getElementById('signup-btn');
            const upgradeBtn = document.getElementById('upgrade-btn');
            const userStatus = document.getElementById('user-status');

            if (loginBtn && signupBtn && upgradeBtn && userStatus) {
                if (member) {
                    // User is logged in
                    userStatus.textContent = 'Welcome, ' + member.full_name;
                    loginBtn.textContent = 'Account';
                    loginBtn.setAttribute('data-memberful-account', '');
                    loginBtn.removeAttribute('data-memberful-sign-in');
                    signupBtn.style.display = 'none';
                    upgradeBtn.style.display = member.subscribed ? 'none' : 'inline';
                } else {
                    // User is not logged in
                    userStatus.textContent = '';
                    loginBtn.textContent = 'Log In';
                    loginBtn.setAttribute('data-memberful-sign-in', '');
                    loginBtn.removeAttribute('data-memberful-account');
                    signupBtn.style.display = 'inline';
                    upgradeBtn.style.display = 'none';
                }
            } else {
                console.error('One or more required elements are missing from the DOM');
            }
        });
    });
