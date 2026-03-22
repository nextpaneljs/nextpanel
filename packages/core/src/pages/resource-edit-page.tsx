import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ResourceConfig, NextPanelActions } from "../types";
import { AutoForm } from "../form/auto-form";

interface ResourceEditPageProps {
  resource: ResourceConfig;
  defaultValues: Record<string, unknown>;
  recordId: string;
  actions: Pick<NextPanelActions, "createRecord" | "updateRecord" | "getRelationOptions">;
}

export function ResourceEditPage({
  resource,
  defaultValues,
  recordId,
  actions,
}: ResourceEditPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" render={<Link href={`/admin/${resource.slug}`} />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {resource.pluralLabel}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit {resource.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <AutoForm
            resource={resource}
            mode="edit"
            defaultValues={defaultValues}
            recordId={recordId}
            actions={actions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
