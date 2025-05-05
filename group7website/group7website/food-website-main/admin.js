<script>
$(document).ready(function() {
    let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    let currentEditingId = null;

    // Toggle Dropdown
    $('.admin-user').click(function(e) {
        e.stopPropagation();
        $('.dropdown-menu').toggle();
    });

    $(document).click(function() {
        $('.dropdown-menu').hide();
    });

    // Load Menu Items
    function loadMenuItems() {
        const tbody = $('.admin-table tbody');
        tbody.empty();
        
        menuItems.forEach((item, index) => {
            tbody.append(`
                <tr data-id="${item.id}">
                    <td>${index + 1}</td>
                    <td><img src="${item.image}" alt="${item.name}" width="50"></td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>Rs. ${item.price}</td>
                    <td><span class="status ${item.status}">${item.status}</span></td>
                    <td>
                        <button class="btn-edit"><i class="uil uil-edit"></i></button>
                        <button class="btn-delete"><i class="uil uil-trash-alt"></i></button>
                    </td>
                </tr>
            `);
        });
    }

    // Show Modal
    function showModal(edit = false, item = null) {
        $('#modalTitle').text(edit ? 'Edit Menu Item' : 'Add New Menu Item');
        $('#menuItemForm')[0].reset();
        
        if(edit && item) {
            $('#itemName').val(item.name);
            $('#itemCategory').val(item.category);
            $('#itemPrice').val(item.price);
            $('#itemDescription').val(item.description);
            $('#itemStatus').val(item.status);
        }
        
        $('#menuItemModal').fadeIn();
    }

    // Save Item
    $('#menuItemForm').submit(function(e) {
        e.preventDefault();
        
        const newItem = {
            id: currentEditingId || Date.now(),
            name: $('#itemName').val(),
            category: $('#itemCategory').val(),
            price: parseFloat($('#itemPrice').val()),
            description: $('#itemDescription').val(),
            status: $('#itemStatus').val(),
            image: $('#itemImage').val() || 'default-food.jpg'
        };

        if(currentEditingId) {
            // Update existing item
            const index = menuItems.findIndex(item => item.id === currentEditingId);
            menuItems[index] = newItem;
        } else {
            // Add new item
            menuItems.push(newItem);
        }

        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        loadMenuItems();
        $('#menuItemModal').fadeOut();
        currentEditingId = null;
    });

    // Edit Item
    $('.admin-table').on('click', '.btn-edit', function() {
        const id = $(this).closest('tr').data('id');
        const item = menuItems.find(item => item.id === id);
        currentEditingId = id;
        showModal(true, item);
    });

    // Delete Item
    $('.admin-table').on('click', '.btn-delete', function() {
        const id = $(this).closest('tr').data('id');
        if(confirm('Are you sure you want to delete this item?')) {
            menuItems = menuItems.filter(item => item.id !== id);
            localStorage.setItem('menuItems', JSON.stringify(menuItems));
            loadMenuItems();
        }
    });

    // Open Add Modal
    $('#addMenuItemBtn').click(() => showModal());

    // Close Modal
    $('.close, .modal').click(function(e) {
        if(e.target === this) {
            $('#menuItemModal').fadeOut();
            currentEditingId = null;
        }
    });

    // Initial Load
    loadMenuItems();
});
</script>