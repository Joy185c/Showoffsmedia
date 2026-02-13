const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg font-bold text-foreground">
          ShowOffs<span className="text-primary"> Media</span>
        </p>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} ShowOffs Media. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
