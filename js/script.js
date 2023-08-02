// Selecting DOM elements
const userOverview = document.querySelector(".overview");
const githubUsername = "jerry-weber";
const repositoryList = document.querySelector(".repo-list");
const allRepositoriesContainer = document.querySelector(".repos");
const repositoryDetails = document.querySelector(".repo-data");
const viewRepositoriesButton = document.querySelector(".view-repos");
const searchInput = document.querySelector(".filter-repos");

// Function to fetch user information from GitHub API
const fetchUserInfo = async function () {
  const userInfoResponse = await fetch(
    `https://api.github.com/users/${githubUsername}`
  );
  const userData = await userInfoResponse.json();
  displayUserInfo(userData);
};

// Call the function to display user information
fetchUserInfo();

// Function to display user information on the page
const displayUserInfo = function (userData) {
  const userInfoDiv = document.createElement("div");
  userInfoDiv.classList.add("user-info");
  userInfoDiv.innerHTML = `
    <figure>
      <img alt="user avatar" src=${userData.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${userData.name}</p>
      <p><strong>Bio:</strong> ${userData.bio}</p>
      <p><strong>Location:</strong> ${userData.location}</p>
      <p><strong>Number of public repos:</strong> ${userData.public_repos}</p>
    </div>
  `;
  userOverview.append(userInfoDiv);
  fetchUserRepositories(githubUsername);
};

// Function to fetch user repositories from GitHub API
const fetchUserRepositories = async function (username) {
  const userReposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const repositoriesData = await userReposResponse.json();
  displayRepositories(repositoriesData);
};

// Function to display user repositories on the page
const displayRepositories = function (repositories) {
  searchInput.classList.remove("hide");
  for (const repository of repositories) {
    const repoItem = document.createElement("li");
    repoItem.classList.add("repo");
    repoItem.innerHTML = `<h3>${repository.name}</h3>`;
    repositoryList.append(repoItem);
  }
};

// Event listener for the repository list to show repository details on click
repositoryList.addEventListener("click", function (event) {
  if (event.target.matches("h3")) {
    const repositoryName = event.target.innerText;
    fetchRepositoryInfo(repositoryName);
  }
});

// Function to fetch repository information from GitHub API
const fetchRepositoryInfo = async function (repositoryName) {
  const repoInfoResponse = await fetch(
    `https://api.github.com/repos/${githubUsername}/${repositoryName}`
  );
  const repositoryInfo = await repoInfoResponse.json();
  // Fetch languages used in the repository
  const languagesResponse = await fetch(repositoryInfo.languages_url);
  const languageData = await languagesResponse.json();
  // Convert languages data to an array
  const languages = Object.keys(languageData);

  displayRepositoryInfo(repositoryInfo, languages);
};

// Function to display repository information on the page
const displayRepositoryInfo = function (repositoryInfo, languages) {
  viewRepositoriesButton.classList.remove("hide");
  repositoryDetails.innerHTML = "";
  repositoryDetails.classList.remove("hide");
  allRepositoriesContainer.classList.add("hide");
  const repoInfoDiv = document.createElement("div");
  repoInfoDiv.innerHTML = `
    <h3>Name: ${repositoryInfo.name}</h3>
    <p>Description: ${repositoryInfo.description}</p>
    <p>Default Branch: ${repositoryInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${
      repositoryInfo.html_url
    }" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repositoryDetails.append(repoInfoDiv);
};

// Event listener for the view repositories button
viewRepositoriesButton.addEventListener("click", function () {
  allRepositoriesContainer.classList.remove("hide");
  repositoryDetails.classList.add("hide");
  viewRepositoriesButton.classList.add("hide");
});

// Event listener for dynamic search
searchInput.addEventListener("input", function (event) {
  const searchText = event.target.value;
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();

  for (const repo of repos) {
    const repoLowerText = repo.innerText.toLowerCase();
    if (repoLowerText.includes(searchLowerText)) {
      repo.classList.remove("hide");
    } else {
      repo.classList.add("hide");
    }
  }
});
