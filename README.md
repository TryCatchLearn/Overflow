# Aspire 13.1 Course repository

This is the updated repository for the Aspire 'Overlow' app created for the Udemy course released in September 2025 (updated in January 2026) and is based on Aspire v13.1.  You can see a demo of this app [here](https://overflow.trycatchlearn.com/).

If you are looking for the previous version code (aspire 9.4) then you can get this here: https://github.com/TryCatchLearn/overflow-aspire-v9.4

You can see how this app was made by checking out the Udemy course for this [here](https://www.udemy.com/course/build-a-microservices-app-with-dotnet-and-nextjs-from-scratch/?couponCode=NEWCOURSEPROM)

You can run this app locally on your computer by following these instructions:

1. Using your terminal or command prompt clone the repo onto your machine in a user folder

```
git clone https://github.com/TryCatchLearn/Overflow.git
```
2. Change into the Overflow directory
```
cd Overflow
```
3. Ensure you have Docker Desktop installed on your machine.  If not download and install from Docker and review their installation instructions for your Operating system [here](https://docs.docker.com/desktop/).
4. Execute the following commands to install the packages for the .Net and NextJS app (you will need the .Net SDK and NodeJS installed to use these commands). We also need to set a password for the typesense service in the dotnet user-secrets
```
# This repo relies on a package not available in nuget yet so add a feed that allows us to use sshdeploy in the app (from here: https://github.com/davidfowl/aspire-ssh-deploy)
dotnet nuget add source https://f.feedz.io/davidfowl/aspire/nuget/index.json --name davidfowl-aspire
dotnet restore
cd Overflow.AppHost
dotnet user-secrets set "Parameters:typesense-api-key" "abc"
cd ../webapp
npm install
```
5. Open the solution in your IDE of choice and run the Overflow.AppHost project
6. Check the terminal where you are running the app and click on the link to be taken to the Aspire dashboard.  It may take several minutes for all the services to be started.
7. You may see warnings for the profice-svc, question-svc and vote-svc.  These can be ignored as this is just Entity Framework trying to fetch the migration history when the app is first run, but as there is no migration history it reports an error before creating this table.
8. You can browse to the web app on http://localhost:3000 and you can login as 'bob'  with the password of 'Pa$$w0rd' without the quotes.  Most functionality will work, but image upload will not unless you replace the values in the Overflow/webapp/.env.development.local with your own Cloudinary account details

### Overflow with AI features

One of the students from the course, **Antonio Cruz**, has independently extended this application to explore AI-driven features on top of the existing architecture.

His work is a great example of how the patterns and ideas from the course can be taken further in a real project. You can view his implementation here:

https://github.com/tonycruz-dev/OverflowDemo

If you find it useful or interesting, feel free to show your support by starring the repository.