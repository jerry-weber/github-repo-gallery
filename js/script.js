// Selecting DOM elements
const userOverview = document.querySelector(".overview");
const username = "jerry-weber";
const repositoryList = document.querySelector(".repo-list");
const allRepositoriesContainer = document.querySelector(".repos");
const repositoryData = document.querySelector(".repo-data");

// Function to fetch user information from GitHub API
const fetchUserInfo = async function () {
  const userInfoResponse = await fetch(
    `https://api.github.com/users/${username}`
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
  fetchUserRepos();
};

// Function to fetch user repositories from GitHub API
const fetchUserRepos = async function () {
  const userReposResponse = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  const repositoriesData = await userReposResponse.json();
  displayRepositories(repositoriesData);
};

// Function to display user repositories on the page
const displayRepositories = function (repositories) {
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
    fetchRepoInfo(repositoryName);
  }
});

// Function to fetch repository information from GitHub API
const fetchRepoInfo = async function (repositoryName) {
  const repoInfoResponse = await fetch(
    `https://api.github.com/repos/${username}/${repositoryName}`
  );
  const repositoryInfo = await repoInfoResponse.json();
  // Fetch languages used in the repository
  const languagesResponse = await fetch(repositoryInfo.languages_url);
  const languagesData = await languagesResponse.json();
  // Convert languages data to an array
  const languages = Object.keys(languagesData);

  displayRepoInfo(repositoryInfo, languages);
};

// Function to display repository information on the page
const displayRepoInfo = function (repositoryInfo, languages) {
  repositoryData.innerHTML = "";
  repositoryData.classList.remove("hide");
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
  repositoryData.append(repoInfoDiv);
};
