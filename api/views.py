from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet
from rest_framework.response import Response
from .serializers import *
from rest_framework.decorators import APIView,api_view,permission_classes,action
from .models import *
from rest_framework import status
from .permissions import *
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.core.mail import send_mail,EmailMessage
from django.conf import settings
from random import randint
from django.db.models import Q
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Extract validated data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Validate data
        validated_data = serializer.validated_data

        # Get the user
        user = serializer.user
        
        response.data['role'] = user.role
        response.data['id'] = user.id
        response.data['email'] = user.email
        response.data['username'] = user.username
        response.data['gender'] = user.gender
        response.data['program'] = user.program.id if user.program else None
        print(response.data)
        print(user.role)
        

        return response


class IssueViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsStudentOrRegistrarOrLecturer]
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    http_method_names = ['put','post','patch','get','delete']
    
    def perform_create(self, serializer):
        # Import User model
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Debug print
        print("--- PERFORMING CREATE ---")
        print(f"Original data: {self.request.data}")
        
        # Extract usernames from request data
        registrar_username = self.request.data.get('registrar')
        student_username = self.request.data.get('student')
        issue_type = self.request.data.get('issue_type')
        
        
        # Handle registrar assignment by username
        registrar = None
        if registrar_username:
            try:
                registrar = User.objects.get(username=registrar_username)
                registrar_email = registrar.email
                # Preparing to alert the Registar by email 
                subject = 'ISSUE HAS BEEN ASSIGNED TO YOU'
                message = f'Dear {registrar_username},\n\n You have been requested to Solve the issue of {issue_type} raised by {student_username}'
                send_mail(subject,message,settings.EMAIL_HOST_USER,[registrar_email],fail_silently=False)
                print(f"Found registrar user: {registrar}")
            except User.DoesNotExist:
                print(f"No user found with username: {registrar_username}")
        
        # Handle student assignment by username
        student = None
        if student_username:
            try:
                student = User.objects.get(username=student_username)
                print(f"Found student user: {student}")
            except User.DoesNotExist:
                print(f"No user found with username: {student_username}")
        
        # Save with the actual user objects
        serializer.save(
            registrar=registrar,
            student=student
        )
        print("--- ISSUE SAVED SUCCESSFULLY ---")
        
class Lecturer_Issue_Manangement(ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated,IsLecturer]
    
    def get_queryset(self): 
        user = self.request.user
        return Issue.objects.filter(lecturer = user)
    
    def send_email_on_update(self,issue,action,previous_state):
        student = issue.student
        
        if student and student.email:
            subject = f'Issue {action} Notification'
            if previous_state:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Previous status: {previous_state}\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            else:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            
            send_mail(subject, message, settings.EMAIL_HOST_USER, [student.email], fail_silently=False)
    
    def perform_update(self, serializer):
        issue = self.get_object()  # This retrieves the current issue instance
        previous_state = issue.status  # Store the previous state of the issue
        
        # Save the updated issue
        updated_issue = serializer.save()
        
        # Send email with previous and current state
        self.send_email_on_update(updated_issue, "updated", previous_state)
        
        return updated_issue
            
    def perform_destroy(self, instance):
        self.send_email_on_update(instance,"deleted")
        instance.delete()

    @action(detail = False, methods= ['get'])
    def filter_results(self,request):
        search_query = request.query_params.get('status','').strip()
        if search_query:
            issues = self.get_queryset().filter(
                Q(status__icontains = search_query) | 
                Q(student__username__icontains = search_query) |
                Q(issue_type__icontains = search_query)
                )
            serializer = self.get_serializer(issues, many = True)
            return Response(serializer.data)
        return Response({'error':'Status parameter required'})
    
class Student_Issue_Viewset(ModelViewSet):
    permission_classes = [IsAuthenticated, IsStudent]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(student = user)
    
        
    @action(detail = False, methods= ['get'])
    def filter_results(self,request):
        search_query = request.query_params.get('status','').strip()
        if search_query:
            issues = self.get_queryset().filter(
                Q(status__icontains = search_query) | 
                Q(issue_type__icontains = search_query)
                )
            serializer = self.get_serializer(issues, many = True)
            return Response(serializer.data)
        return Response({'error':'Status parameter required'})
    
    
    
class Registrar_Issue_ManagementViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated,IsAcademicRegistrar]
    serializer_class = IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Issue.objects.filter(registrar = user)
    
    def send_email_on_update(self,issue,action,previous_state):
        student = issue.student
        
        if student and student.email:
            subject = f'Issue {action} Notification'
            if previous_state:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Previous status: {previous_state}\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            else:
                message = (f'Dear {student.username},\n\n'
                           f'Your issue of {issue.issue_type} has been {action}.\n'
                           f'Current status: {issue.status}\n\n'
                           'Best regards,\nAITS')
            
            send_success = send_mail(subject, message, settings.EMAIL_HOST_USER, [student.email], fail_silently=False)
            if send_success > 0:
                Email_Notification.objects.create(
                    user = student, 
                    issue = issue, 
                    subject = subject, 
                    message = message).save()
    
    def perform_update(self, serializer):
        issue = self.get_object()  # This retrieves the current issue instance
        previous_state = issue.status  # Store the previous state of the issue
        previous_lecturer = issue.lecturer
        # Save the updated issue
        updated_issue = serializer.save()
        
        # Send email with previous and current state
        self.send_email_on_update(updated_issue, "updated", previous_state)
        
        if previous_lecturer != updated_issue.lecturer and updated_issue.lecturer and updated_issue.lecturer.email:
            subject = f'Issue Assignment Notification'
            message = (f'Dear {updated_issue.lecturer.username},\n\n'
                  f'You have been assigned to an issue of type {updated_issue.issue_type}.\n'
                  f'Student: {updated_issue.student.username if updated_issue.student else "N/A"}\n'
                  f'Current status: {updated_issue.status}\n\n'
                  'Best regards,\nAITS')
            send_success = send_mail(subject, message, settings.EMAIL_HOST_USER, [updated_issue.lecturer.email], fail_silently=False)
        
        return updated_issue
            
    def perform_destroy(self, instance):
        self.send_email_on_update(instance,"deleted")
        instance.delete()
        
    @action(detail = False, methods= ['get'])
    def filter_results(self,request):
        search_query = request.query_params.get('status','').strip()
        if search_query:
            issues = self.get_queryset().filter(
                Q(status__icontains = search_query) | 
                Q(student__username__icontains = search_query) |
                Q(issue_type__icontains = search_query)
                )
            serializer = self.get_serializer(issues, many = True)
            return Response(serializer.data)
        return Response({'error':'Status parameter required'})
    
            
    
    
class DepartmentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class Course_unitViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Course_unit.objects.all()
    serializer_class = Course_unitSerializer

class ProgramViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    
class Lecturer_and_Registrar_Registration(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        data = request.data.copy()
        print(data)
        token_value = data['registration_token']
        email_value = data['email']
        
        token_object = Registration_Token.objects.filter(token=token_value, email=email_value).first()
        if token_object:
            data['role'] = token_object.role 
            data['is_email_verified'] = True
            
            
        serializer = Lecturer_and_Registrar_RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()  # Save user using serializer
            return Response({
                "message": "User Created Successfully",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "gender": user.gender,
                    "role":user.role,
                    "program": user.program.id if user.program else None,
                    "is_email_verified": user.is_email_verified,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Student_Registration(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        print(request.data)
        data=request.data
        serializer = Student_RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()  # Save user using serializer
            print(serializer.validated_data)
            '''Creating and saving the verification code object..'''
            
            verification_code = randint(10000,99999)
            verification,created = Verification_code.objects.get_or_create(
                user = user,
                defaults={"code": verification_code})
            
            verification.code = verification_code
            #verification_code.created_at = timezone.now()
            verification.save()
                
            subject = 'Email Verification Code'
            message = f"Hello, your Verification code is: {verification_code}"
            recipient_email = data.get('email')

            email = EmailMessage(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [recipient_email]
            )
            #try:
            email.send(fail_silently=False)
            return Response({
                    "message": "User Created Successfully, Token created and email sent!",
                    "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "email": user.email,
                    "role":user.role,
                    "gender": user.gender,
                    "program": user.program.id if user.program else None,
                    "is_email_verified": user.is_email_verified,
                
                    }}, status=status.HTTP_201_CREATED)
            #except Exception as e:
                #print(f"Email sending failed: {str(e)}")
        print(serializer.errors)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class Registration_Token_viewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Registration_Token.objects.all()
    serializer_class = Registration_Token_Serializer
    http_method_names = ['get','post','delete']
    
    def create(self,request):
        serializer = self.get_serializer(data = request.data)
        
        if serializer.is_valid():
            token_instance = serializer.save()
            
            subject = "Your Registration Token for the Academic Issue Tracking System"
            message = f"Hello, your registration token is: {token_instance.token}"
            receipient_email = token_instance.email
            
            try:
                print(token_instance.token)
                send_mail(subject,message,settings.EMAIL_HOST_USER,[receipient_email],fail_silently=False)
                return Response({"message": "Token created and email sent!"}, status=status.HTTP_201_CREATED)
            
            
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['POST'])
def verify_email(request):
    data = request.data
    serializer = Verify_Email_serializer(data = data)
    if serializer.is_valid():
        verification_code = serializer.validated_data.get('code')
        user_email = serializer.validated_data.get('email')
        
        try:
            user = CustomUser.objects.get(email=user_email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

        try:
            verification = Verification_code.objects.get(user = user,code = verification_code)
            
            if verification.is_verification_code_expired():
                return Response({'error':'Verification Code has expired..'},status = status.HTTP_400_BAD_REQUEST)
            
            verification.is_verified = True
            verification.save()
            
            user.is_email_verified = True
            user.save()
            return Response({'Message':'Email verified successfully...'},status = status.HTTP_200_OK)
            
            
        except Verification_code.DoesNotExist:
            return Response({'error':'Verification Code doesnot exist..'},status = status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
    
    
    
@api_view(['POST'])
def resend_verification_code(request):
    data = request.data
    serializer = Resend_Verification_CodeSerializer(data = data)
    if serializer.is_valid():
        user_email = serializer.validated_data.get('email')
        try:
            user = CustomUser.objects.get(email = user_email)
        except CustomUser.DoesNotExist:
            return Response({'Error':'No user found...'})
        
        result = Verification_code.resend_verification_code(user = user, subject= 'Email verification Code Resend..')
        if result:
            return Response({'Message':f'Successful.....'},status=status.HTTP_200_OK)
        return Response({'Error':'Failure...........--'},status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def password_reset_code(request):
    serializer = Password_ResetSerializer(data = request.data)
    if serializer.is_valid():
        email = serializer.validated_data.get('email')
        
        try:
            user = CustomUser.objects.get(email = email)
        except Exception as e:
            return Response({'Error': e})
        
        verification_code, created = Verification_code.objects.get_or_create(user=user)
        verification_code.code = randint(10000, 99999)
        verification_code.is_verified = False
        verification_code.save()
        
        send_mail(
            "Password Reset Code",
            f"Your password reset code is {verification_code.code}. It will expire in 30 minutes.",
            "no-reply@aits.com",
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "Password reset code sent to email"}, status=status.HTTP_200_OK)
        
        
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def resend_password_reset_code(request):
    serializer= Resend_Password_Reset_CodeSerializer(data = request.data)
    if serializer.is_valid():
        user_email = serializer.validated_data.get('email')
        try:
            user = CustomUser.objects.get(email = user_email)
        except CustomUser.DoesNotExist:
            return Response({'Error':'No user found...'})
        """I am using the verification code model to rsend the password reset code.."""
        result = Verification_code.resend_verification_code(user = user, subject= 'Reset Account Password...')
        if result:
            return Response({'Message':f'Successfully Resent the Password Reset Code .....'},status=status.HTTP_200_OK)
        return Response({'Error':'Failure...........--'},status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
     
        
@api_view(['POST'])
def verify_password_reset_code(request):
    serializer = Verify_Password_Reset_CodeSerializer(data = request.data)
    if serializer.is_valid():
        code = serializer.validated_data.get('code')
        user = serializer.validated_data.get('user')
        print(serializer.validated_data)
        get_code = Verification_code.objects.filter(code=code).first()
        if not get_code:
            return Response({"error": "Invalid verification code or user."}, status=status.HTTP_400_BAD_REQUEST)

        if get_code.is_verification_code_expired():
            return Response({"error": "Verification code has expired"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Message':'Confirmed...'})
        
        
        
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        
        
@api_view(['POST'])
def final_password_reset(request):
    print(request.data)
    serializer = Final_Password_ResetSerializer(data = request.data)
    if serializer.is_valid():
        password = serializer.validated_data.get('password')
        confirm_password = serializer.validated_data.get('confirm_password')
        email = serializer.validated_data.get('email')
        
        try:
            get_user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        get_user.set_password(password)
        #get_user.set_password(confirm_password)
        
        get_user.save()
        
        return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
    return Response(serializer.errors,status = status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_email_notifications(request):
    notifications = Email_Notification.objects.filter(user = request.user)
    number = notifications.count()
    serializer = Email_notificationSerializer(notifications,many = True)
    return Response ({'number':number,
                      'data':serializer.data})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_registrars(request):
    registrars = CustomUser.objects.filter(role='academic_registrar')
    
    serializer = UserSerializer(registrars, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_lecturers(request):
    lecturers = CustomUser.objects.filter(role='lecturer')
    
    serializer = UserSerializer(lecturers, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_students(request):
    students = CustomUser.objects.filter(role='student')
    
    serializer = UserSerializer(students, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user_id_from_frontend = request.data.get('userId') 
    if str(request.user.id) != str(user_id_from_frontend):
        return Response(
            {"error": "You are not authorized to delete this account."},
            status=status.HTTP_403_FORBIDDEN
        )

    user = CustomUser.objects.filter(id=user_id_from_frontend).first()
    if user:
        username = user.username
        user.delete()
        return Response(
            {"message": f"Account '{username}' has been deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )
    else:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)








class ConversationViewSet(ModelViewSet):
    """
    API endpoint for conversations
    """
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return conversations that involve the authenticated user
        """
        return Conversation.objects.filter(
            participants=self.request.user
        ).order_by('-updated_at')
    
    def create(self, request, *args, **kwargs):
        """
        Create a new conversation or get existing one
        """
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {"error": "User ID is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            other_user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if conversation already exists
        existing_conversation = Conversation.objects.filter(
            participants=request.user
        ).filter(
            participants=other_user
        ).first()
        
        if existing_conversation:
            serializer = self.get_serializer(existing_conversation)
            return Response(serializer.data)
        
        # Create new conversation
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, other_user)
        
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """
        Get all messages in a conversation
        """
        try:
            conversation = self.get_object()
            
            # Verify user is part of conversation
            if request.user not in conversation.participants.all():
                return Response(
                    {"error": "User not authorized to view this conversation"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
            
        except Conversation.DoesNotExist:
            return Response(
                {"error": "Conversation not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get all messages in this conversation
        messages = Message.objects.filter(
            conversation=conversation,
            is_deleted=False
        ).order_by('timestamp')
        
        # Mark messages as read
        unread_messages = messages.filter(receiver=request.user, is_read=False)
        for message in unread_messages:
            message.mark_as_read()
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """
        Mark all messages in conversation as read
        """
class UserSearchView(generics.ListAPIView):
    """
    API endpoint to search for users
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return users matching the search query
        """
        query = self.request.query_params.get('q', '')
        if not query:
            return CustomUser.objects.none()
        
        return CustomUser.objects.filter(
            Q(username__icontains=query) | 
            Q(first_name__icontains=query) | 
            Q(last_name__icontains=query) | 
            Q(email__icontains=query)
        ).exclude(id=self.request.user.id)
        
        
        
class MessageViewSet(ModelViewSet):
    """
    API endpoint for messages
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return messages that involve the authenticated user
        """
        user = self.request.user
        return Message.objects.filter(
            Q(sender=user) | Q(receiver=user),
            is_deleted=False
        ).order_by('timestamp')
    
    def create(self, request, *args, **kwargs):
        """
        Create a new message with support for both conversation_id and receiver_id
        """
        data = request.data
        conversation_id = data.get('conversation_id')
        receiver_id = data.get('receiver_id')
        content = data.get('content')
        
        if not content:
            return Response(
                {"error": "Message content is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Case 1: Using receiver_id to send a message
            if receiver_id:
                try:
                    receiver = CustomUser.objects.get(id=receiver_id)
                except CustomUser.DoesNotExist:
                    return Response(
                        {"error": "Receiver not found"}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                # Find or create a conversation between these users
                conversation = Conversation.objects.filter(
                    participants=request.user
                ).filter(
                    participants=receiver
                ).first()
                
                if not conversation:
                    # Create a new conversation
                    conversation = Conversation.objects.create()
                    conversation.participants.add(request.user, receiver)
                
                # Create the message
                message = Message.objects.create(
                    sender=request.user,
                    receiver=receiver,
                    content=content,
                    conversation=conversation
                )
                
            # Case 2: Using conversation_id to send a message
            elif conversation_id:
                try:
                    conversation = Conversation.objects.get(id=conversation_id)
                except Conversation.DoesNotExist:
                    return Response(
                        {"error": "Conversation not found"}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                if request.user not in conversation.participants.all():
                    return Response(
                        {"error": "User not part of this conversation"}, 
                        status=status.HTTP_403_FORBIDDEN
                    )
                
                # Get the other user
                receiver = conversation.participants.exclude(id=request.user.id).first()
                if not receiver:
                    return Response(
                        {"error": "Invalid conversation"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Create the message
                message = Message.objects.create(
                    sender=request.user,
                    receiver=receiver,
                    content=content,
                    conversation=conversation
                )
            else:
                return Response(
                    {"error": "Either conversation_id or receiver_id is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update conversation timestamp
            conversation.update_timestamp()
            
            serializer = self.get_serializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def conversation(self, request):
        """
        Get all messages between the authenticated user and a specific user
        """
        user = request.user
        other_user_id = request.query_params.get('user_id')
        
        if not other_user_id:
            return Response(
                {"error": "User ID parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            other_user = CustomUser.objects.get(id=other_user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        messages = Message.objects.filter(
            (Q(sender=user) & Q(receiver=other_user)) | 
            (Q(sender=other_user) & Q(receiver=user)),
            is_deleted=False
        ).order_by('timestamp')
        
        # Mark messages as read
        unread_messages = messages.filter(receiver=user, is_read=False)
        for message in unread_messages:
            message.mark_as_read()
        
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """
        Get the count of unread messages for the authenticated user
        """
        unread_count = Message.objects.filter(
            receiver=request.user,
            is_read=False,
            is_deleted=False
        ).count()
        
        return Response({"unread_count": unread_count})