# **BookFinder** 📚
 ## ✨ **Features**
- Advanced Search: Search books by title, author, subject, or ISBN
- Smart Filtering: Filter by language, publication year, and sort options
- Dual View Modes: Switch between grid and list views
- Favorites System: Save your favorite books with local storage persistence
- Detailed Book Information: View comprehensive book details in a modal
- Responsive Design: Optimized for desktop, tablet, and mobile devices
- Search History: Keep track of your recent searches
- Pagination: Navigate through large result sets efficiently

---
## 🛠️ **Built With**
- React - Frontend framework
- TypeScript - Type safety and better development experience
- Tailwind CSS - Utility-first CSS framework for styling
- Lucide React - Beautiful & consistent icon toolkit
- Open Library API - Comprehensive book data source

---
## 📁 **Project Structure**
```text
src/
├── components/          # React components
│   ├── BookCard.tsx    # Individual book card component
│   ├── BookDetailModal.tsx # Book details modal
│   ├── BookGrid.tsx    # Grid/list layout component
│   ├── ErrorMessage.tsx # Error display component
│   ├── Header.tsx      # Application header
│   ├── LoadingState.tsx # Loading indicator
│   ├── NoResults.tsx   # No results display
│   ├── Pagination.tsx  # Pagination controls
│   ├── ResultsHeader.tsx # Results summary header
│   └── SearchForm.tsx  # Search and filters form
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # Local storage utility
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   └── api.ts          # API helper functions
├── constants/          # Application constants
└── App.tsx            # Main application component
```
---
## 🎨 **Component Overview**

- **BookCard** <br>
Displays book information in either grid or list view with favorite toggle functionality.

- **BookDetailModal** <br>
Shows comprehensive book details including cover, metadata, subjects, and publisher information.

- **SearchForm** <br>
Handles search input, filter options, and search history with an intuitive interface.

- **Pagination** <br>
Smart pagination component that shows current results and allows navigation through pages.

---
## 🔧 **Custom Hooks**
- **useLocalStorage** <br>
Persists data to local storage and synchronizes it across browser sessions.

- **useBookSearch** <br>
Manages book search operations, API calls, and result handling.

---
## 🌐 **API Integration**
The application integrates with the Open Library API to:

- Search for books by various criteria

- Retrieve book covers and metadata

- Access detailed book information
---
## 🎯 **Key Functionalities**
1. **Search & Filter**: Combine multiple search criteria for precise results
2. **View Customization**: Switch between grid and list layouts
3. **Book Management**: Save favorites and view detailed information
4. **Responsive Pagination**: Handle large datasets efficiently
5. **Persistent Data**: Maintain search history and favorites across sessions
---
## 📱 Responsive Design
The application is fully responsive and optimized for:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

 ---
## 🚀 Getting Started
**Prerequisites**
- Node.js (v14 or higher)
- npm or yarn

**Installation**
1. Clone the repository:

```bash
git clone <your-repo-url>
cd bookfinder
```
2. Install dependencies:

```bash
npm install
```
3. Start the development server:
```bash
npm start
```
4. Open (http://localhost:3000) to view the app in your browser.
 ---
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details. 
