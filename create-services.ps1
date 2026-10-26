$services = "Login", "Student", "Course", "Exam", "Notification"

foreach ($s in $services) {
    $name = "${s}Service"
    $path = "src/$name"

    dotnet new classlib -n "$name.Domain"         -o "$path/$name.Domain"
    dotnet new classlib -n "$name.Application"    -o "$path/$name.Application"
    dotnet new classlib -n "$name.Infrastructure" -o "$path/$name.Infrastructure"
    dotnet new webapi   -n "$name.Api"            -o "$path/$name.Api"

    dotnet add "$path/$name.Application"    reference "$path/$name.Domain"
    dotnet add "$path/$name.Infrastructure" reference "$path/$name.Application"
    dotnet add "$path/$name.Api"            reference "$path/$name.Application"
    dotnet add "$path/$name.Api"            reference "$path/$name.Infrastructure"

    dotnet sln add "$path/$name.Domain" "$path/$name.Application" "$path/$name.Infrastructure" "$path/$name.Api"

    Remove-Item "$path/$name.Domain/Class1.cs"
    Remove-Item "$path/$name.Application/Class1.cs"
    Remove-Item "$path/$name.Infrastructure/Class1.cs"
}

dotnet new web -n ApiGateway -o src/ApiGateway
dotnet sln add src/ApiGateway

dotnet build