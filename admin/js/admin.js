// Admin Dashboard JavaScript

// Toast notification function
function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Approve booking function
function approveBooking(bookingId) {
    if (!confirm('Are you sure you want to approve this booking?')) {
        return;
    }
    
    fetch('ajax/approve_booking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `booking_id=${bookingId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Booking approved successfully!', 'success');
            // Remove the booking item from the list
            const bookingItem = document.querySelector(`[data-booking-id="${bookingId}"]`);
            if (bookingItem) {
                bookingItem.style.opacity = '0.5';
                setTimeout(() => {
                    bookingItem.remove();
                }, 1000);
            }
        } else {
            showToast('Error approving booking: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error approving booking', 'error');
    });
}

// Cancel booking function
function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    fetch('ajax/cancel_booking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `booking_id=${bookingId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Booking cancelled successfully!', 'success');
            // Remove the booking item from the list
            const bookingItem = document.querySelector(`[data-booking-id="${bookingId}"]`);
            if (bookingItem) {
                bookingItem.style.opacity = '0.5';
                setTimeout(() => {
                    bookingItem.remove();
                }, 1000);
            }
        } else {
            showToast('Error cancelling booking: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error cancelling booking', 'error');
    });
}

// Approve rating function
function approveRating(ratingId) {
    if (!confirm('Are you sure you want to approve this rating?')) {
        return;
    }
    
    fetch('ajax/approve_rating.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `rating_id=${ratingId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Rating approved successfully!', 'success');
            // Update the rating card
            const ratingCard = document.querySelector(`[data-rating-id="${ratingId}"]`);
            if (ratingCard) {
                const actions = ratingCard.querySelector('.rating-actions');
                actions.innerHTML = '<span class="text-success">Approved</span>';
            }
        } else {
            showToast('Error approving rating: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error approving rating', 'error');
    });
}

// Delete rating function
function deleteRating(ratingId) {
    if (!confirm('Are you sure you want to delete this rating?')) {
        return;
    }
    
    fetch('ajax/delete_rating.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `rating_id=${ratingId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('Rating deleted successfully!', 'success');
            // Remove the rating card
            const ratingCard = document.querySelector(`[data-rating-id="${ratingId}"]`);
            if (ratingCard) {
                ratingCard.style.opacity = '0.5';
                setTimeout(() => {
                    ratingCard.remove();
                }, 1000);
            }
        } else {
            showToast('Error deleting rating: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error deleting rating', 'error');
    });
}

// Approve user function
function approveUser(userId) {
    if (!confirm('Are you sure you want to approve this user?')) {
        return;
    }
    
    fetch('ajax/approve_user.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user_id=${userId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('User approved successfully!', 'success');
            // Remove the user from pending list
            const userItem = document.querySelector(`[data-user-id="${userId}"]`);
            if (userItem) {
                userItem.style.opacity = '0.5';
                setTimeout(() => {
                    userItem.remove();
                }, 1000);
            }
        } else {
            showToast('Error approving user: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error approving user', 'error');
    });
}

// View booking details function
function viewBookingDetails(bookingId) {
    // This could open a modal or navigate to a details page
    window.location.href = `bookings/view.php?id=${bookingId}`;
}

// Generate star display for ratings
function generateStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += '<span class="star">★</span>';
        } else {
            starsHtml += '<span class="star empty">☆</span>';
        }
    }
    return starsHtml;
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc2626';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    return isValid;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Add active class to current page navigation
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        if (item.getAttribute('href') && currentPage.includes(item.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
    
    // Auto-refresh dashboard data every 30 seconds (optional)
    if (currentPage.includes('index.php')) {
        setInterval(function() {
            // You could implement auto-refresh of dashboard data here
            console.log('Dashboard data refresh...');
        }, 30000);
    }
});

// Mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Delete confirmation
function confirmDelete(itemType, itemId) {
    return confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
} 