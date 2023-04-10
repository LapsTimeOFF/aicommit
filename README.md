<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">AiCommit</h3>

  <p align="center">
    Generate detailed commit messages for your projects using AI 🤯
    <br />
    <a href="#about-the-project">View Demo</a>
    ·
    <a href="https://github.com/LapsTimeOFF/aicommit/issues">Report Bug</a>
    ·
    <a href="https://github.com/LapsTimeOFF/aicommit/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Demo][product-screenshot]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Install the package:

    * npm
    ```sh
    npm install aicommit -g
    ```
    * yarn
    ```sh
    yarn add aicommit -g
    ```
    * pnpm
    ```sh
    pnpm i -g aicommit
    ```

2. Init your configuration:

    ```sh
        aicommit config -g emoji
    ```

    This will create your config file.
3. Set the keys of the config:

    ```sh
        aicommit config -s <key>=<value>
    ```

Available keys:
| Keys | Type of value | Details |
|---|---|---|
| emoji | boolean | Specify if the msg need to start with an emoji |
| scope | boolean | Specify if the msg need a scope : emoji type**(scope)**: description |
| autoPush | boolean | Specify if the msg need to push automatically after the commit |
| description | boolean | Specify if the msg need to have a description |


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Install the package like the previous step says, then in your git project, add a file `git add (file name)`, then do `aicommit`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


See the [open issues](https://github.com/LapsTimeOFF/aicommit/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the GPL-v3.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@lapstime_](https://twitter.com/lapstime_) - contact@lapstime.fr

Project Link: [https://github.com/LapsTimeOFF/aicommit](https://github.com/LapsTimeOFF/aicommit)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/LapsTimeOFF/aicommit.svg?style=for-the-badge
[contributors-url]: https://github.com/LapsTimeOFF/aicommit/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LapsTimeOFF/aicommit.svg?style=for-the-badge
[forks-url]: https://github.com/LapsTimeOFF/aicommit/network/members
[stars-shield]: https://img.shields.io/github/stars/LapsTimeOFF/aicommit.svg?style=for-the-badge
[stars-url]: https://github.com/LapsTimeOFF/aicommit/stargazers
[issues-shield]: https://img.shields.io/github/issues/LapsTimeOFF/aicommit.svg?style=for-the-badge
[issues-url]: https://github.com/LapsTimeOFF/aicommit/issues
[product-screenshot]: https://test-cdn.lapstime.fr/u/EyBDoy.gif
