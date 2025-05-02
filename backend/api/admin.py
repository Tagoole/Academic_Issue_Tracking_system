from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin



class IssueAdmin(admin.ModelAdmin):  # Custom admin configuration for the Issue model
    def get_fields(self, request, obj=None):  # Customizes the fields displayed in the admin interface based on the user's role
        fields = super().get_fields(request, obj)  # Retrieves the default fields for the admin interface
        if request.user.role == 'student':  # Checks if the logged-in user has the role of 'student'
            fields = [field for field in fields if field != 'lecturer']  # Removes the 'lecturer' field if the user is a student
        return fields
    
    

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_active')  # Display user info
    list_filter = ('role', 'groups')  # Filter by role and groups
    search_fields = ('username', 'email', 'role')

    # Use UserAdmin.fieldsets without modifying it directly
    fieldsets = (
        ('User Information', {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
        ('Role Information', {'fields': ('role',)}),  # Add 'role' separately
    )



@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    filter_horizontal = ('course_units',)  # Enables a horizontal filter widget for the course_units field in the admin interface

admin.site.register(CustomUser, CustomUserAdmin)  # Registers the CustomUser model with the admin site using CustomUserAdmin
admin.site.register(Issue)  # Registers the Issue model with the admin site
admin.site.register(Department)  # Registers the Department model with the admin site
admin.site.register(Course_unit)  # Registers the Course_unit model with the admin site
admin.site.register(Registration_Token)  # Registers the Registration_Token model with the admin site
admin.site.register(Verification_code)  # Registers the Verification_code model with the admin site
admin.site.register(Email_Notification)  # Registers the Email_Notification model with the admin site
admin.site.register(Message)  # Registers the Message model with the admin site
admin.site.register(Conversation)  # Registers the Conversation model with the admin site