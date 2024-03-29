function NavBar(){
  return (
    <header>
    <nav className="shadow-lg py-2 bg-white w-full fixed top-0 right-0 left-0 z-20">
    <div className="flex flex-row justify-between px-6">
        <div className="items-center" id="navbarSupportedContentX">
          <ul className="mr-auto flex flex-row">
            <li>
              <a className="block py-2 pr-4 text-gray-600 hover:text-gray-700 focus:text-gray-700"
              href="">Check</a>
            </li>
            <li>
              <a className="block p-2 pr-4 text-gray-600 hover:text-gray-700 focus:text-gray-700"
                href="learn">Learn</a>
            </li>
            <li >
            <a className="nav-link block p-2 text-gray-600 hover:text-gray-700 focus:text-gray-700"
              href="about">About</a>
            </li>
          </ul>
        </div>
        <h1 className="text-2xl p-1">✅ ✅ ✅</h1>
        <button className="font-bold mt-1 px-3 rounded bg-blue-500 hover:bg-blue-700 text-white" 
          type="submit" form="code-form">Check style</button>
    </div>
    </nav>
    </header>
  );
}

export default NavBar;