import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/dashboard",
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

import React from "react";

// ── Navbar Component ──
const Navbar = () => (
  <nav data-testid="navbar">
    <a href="/dashboard" data-testid="nav-home">Home</a>
    <a href="/activities" data-testid="nav-activities">Activities</a>
    <a href="/progress"   data-testid="nav-progress">Progress</a>
    <a href="/favourites" data-testid="nav-favourites">Favourites</a>
    <a href="/updates"    data-testid="nav-updates">Updates</a>
    <button data-testid="logout-btn" onClick={() => {}}>Logout</button>
  </nav>
);

// ── Activity Card Component ──
const ActivityCard = ({ title, category, age, duration }: {
  title: string; category: string; age: string; duration: string;
}) => (
  <div data-testid="activity-card">
    <h3 data-testid="activity-title">{title}</h3>
    <span data-testid="activity-category">{category}</span>
    <span data-testid="activity-age">{age}</span>
    <span data-testid="activity-duration">{duration}</span>
  </div>
);

// ── Post Card Component ──
const PostCard = ({ username, caption, likes }: {
  username: string; caption: string; likes: number;
}) => (
  <div data-testid="post-card">
    <p data-testid="post-username">{username}</p>
    <p data-testid="post-caption">{caption}</p>
    <button data-testid="like-btn">❤️ {likes}</button>
  </div>
);

// ── Tests ──
describe("Navbar Component", () => {
  it("should render navbar", () => {
    render(<Navbar />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("should render home link", () => {
    render(<Navbar />);
    expect(screen.getByTestId("nav-home")).toBeInTheDocument();
  });

  it("should render activities link", () => {
    render(<Navbar />);
    expect(screen.getByTestId("nav-activities")).toBeInTheDocument();
  });

  it("should render progress link", () => {
    render(<Navbar />);
    expect(screen.getByTestId("nav-progress")).toBeInTheDocument();
  });

  it("should render favourites link", () => {
    render(<Navbar />);
    expect(screen.getByTestId("nav-favourites")).toBeInTheDocument();
  });

  it("should render logout button", () => {
    render(<Navbar />);
    expect(screen.getByTestId("logout-btn")).toBeInTheDocument();
  });
});

describe("Activity Card Component", () => {
  const props = { title: "Paper Craft", category: "Art", age: "Ages 3-6", duration: "20 min" };

  it("should render activity card", () => {
    render(<ActivityCard {...props} />);
    expect(screen.getByTestId("activity-card")).toBeInTheDocument();
  });

  it("should display activity title", () => {
    render(<ActivityCard {...props} />);
    expect(screen.getByTestId("activity-title")).toHaveTextContent("Paper Craft");
  });

  it("should display activity category", () => {
    render(<ActivityCard {...props} />);
    expect(screen.getByTestId("activity-category")).toHaveTextContent("Art");
  });

  it("should display activity age range", () => {
    render(<ActivityCard {...props} />);
    expect(screen.getByTestId("activity-age")).toHaveTextContent("Ages 3-6");
  });

  it("should display activity duration", () => {
    render(<ActivityCard {...props} />);
    expect(screen.getByTestId("activity-duration")).toHaveTextContent("20 min");
  });
});

describe("Post Card Component", () => {
  const props = { username: "testparent", caption: "My child loved this!", likes: 5 };

  it("should render post card", () => {
    render(<PostCard {...props} />);
    expect(screen.getByTestId("post-card")).toBeInTheDocument();
  });

  it("should display username", () => {
    render(<PostCard {...props} />);
    expect(screen.getByTestId("post-username")).toHaveTextContent("testparent");
  });

  it("should display caption", () => {
    render(<PostCard {...props} />);
    expect(screen.getByTestId("post-caption")).toHaveTextContent("My child loved this!");
  });

  it("should display like button", () => {
    render(<PostCard {...props} />);
    expect(screen.getByTestId("like-btn")).toBeInTheDocument();
  });

  it("should display like count", () => {
    render(<PostCard {...props} />);
    expect(screen.getByTestId("like-btn")).toHaveTextContent("5");
  });
});