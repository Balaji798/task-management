import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./header.css"

const Header = () => {
	const navRef = useRef<HTMLElement | null>(null);

	const showNavbar = () => {
		if (navRef.current) {
			navRef.current.classList.toggle("responsive_nav");
		  }
	};

	return (
		<header>
			{/* <h3>My Todo</h3> */}
			<nav ref={navRef}>
				{/* <a href="/#">Home</a>
				<a href="/#">My work</a>
				<a href="/#">Blog</a>
				<a href="/#">About me</a>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button> */}
			</nav>
			{/* <button
				className="nav-btn"
				onClick={showNavbar}>
				<FaBars />
			</button> */}
		</header>
	);
}

export default Header